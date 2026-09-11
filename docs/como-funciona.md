# Cómo funciona tupu

El recorrido completo de un dato, de OpenStreetMap a la pantalla del teléfono, y qué hace cada
pieza. Para el *porqué* de cada elección están las [decisiones](decisiones/); acá está el *cómo*.

Si aparece una palabra rara, está en el [glosario](glosario.md).

## Lo que hay en pie hoy

| | Estado |
|---|---|
| Mapa con la red ciclista de Lima | Funciona, con datos del API |
| Dónde estoy, con el cono de la brújula | Funciona |
| Mapa que te sigue y rota, en tres modos | Funciona |
| Ruta A→B | El API la calcula; **la pantalla todavía no la dibuja** |
| Grabación del recorrido | No empezada |

Y un requisito que conviene tener presente: **el teléfono necesita Google Play Services** para
ubicarte. Está explicado más abajo, en «Dónde estoy».

## El recorrido de un dato

Hay dos caminos distintos, y arrancan en la misma descarga.

```
                    Geofabrik: peru-latest.osm.pbf  (~250 MB)
                                   │
                    osm:update, a mano, decenas de minutos
                    ┌──────────────┴───────────────┐
                    ▼                              ▼
        osmium filtra ciclovías          valhalla_build_tiles
        ogr2ogr las carga                construye el grafo
                    ▼                              ▼
            PostGIS · tabla cycleways      Valhalla · /data/tiles
                    │                              │
   GET /v1/cycleways/in-bbox            POST /v1/routing/plan
                    │                              │
                    ▼                              ▼
              GeoJSON                       polilínea + km + minutos
                    └──────────────┬───────────────┘
                                   ▼
                            apps/mobile · MapLibre
```

Que los dos salgan de la **misma** descarga es a propósito: si el mapa y el ruteo se llenaran por
separado, la app podría dibujar una ciclovía por la que el motor no sabe rutear
([0020](decisiones/0020-actualizacion-de-datos-en-un-comando.md)).

## Las cuatro piezas

```
apps/api             Hono sobre Bun. Habla con PostGIS y con Valhalla
apps/mobile          Expo Router. Lo único que ve el usuario
packages/contracts   esquemas de Zod: qué se manda y qué se recibe
packages/geo         matemática geográfica pura, sin red ni base de datos
```

`apps/*` importa de `packages/*` y **nunca al revés**; las dos apps no se importan entre sí. La
única excepción es que el móvil importa de `@tupu/api` el tipo `AppType` y nada más, que es lo que
hace que el cliente HTTP esté tipado: si el API cambia un endpoint, el móvil deja de compilar. Lo
hace cumplir Biome ([0002](decisiones/0002-layout-del-repo.md), [0004](decisiones/0004-hono-en-el-api.md)).

## La ingesta: de OSM a PostGIS

`infra/osm/update.sh` son cuatro pasos, y el tercero corre
`apps/api/src/features/cycleways/ingest.ts`, que vive junto a su feature
([0008](decisiones/0008-apps-api-por-funcionalidad.md)).

1. `osmium` se queda solo con las vías etiquetadas como infraestructura ciclista.
2. `ogr2ogr` las mete en una tabla cruda.
3. Un `INSERT ... SELECT` las normaliza a las tres clases y **reemplaza la tabla en una sola
   transacción**.
4. Si la red se encogiera a menos de la mitad de la corrida anterior, aborta. Una ingesta rota no
   puede dejar la app sin ciclovías.

Cada corrida deja una fila en `osm_imports` con la fecha del extracto y cuántos tramos entraron:
es la edad real de los datos, no la fecha en que se corrió.

### Las tres clases

OSM etiqueta la infraestructura ciclista de varias formas y la app las reduce a tres, porque tres
es lo que un ciclista necesita distinguir de un vistazo:

| `kind` | Qué es | Cómo se dibuja |
|---|---|---|
| `track` | Vía propia, separada del tráfico | Verde continuo con halo blanco |
| `lane` | Carril pintado sobre la calzada | Verde punteado, más fino |
| `shared` | Se comparte el asfalto con los autos | Ámbar punteado |

Los colores viven en `apps/mobile/lib/map.ts` porque MapLibre necesita el literal, no una clase de
Tailwind.

## El mapa: dos capas que no se mezclan

**El fondo** —calles, edificios, nombres— son tiles de OpenFreeMap, un servicio de terceros. Es
una sola URL en `MAP_STYLE_URL`; cambiar de proveedor es cambiar esa línea
([0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md)).

**La red ciclista** se dibuja encima, con datos del API. Se intentó sacarla del propio tile y no
alcanzó: sobre el Centro el tile traía 4 tramos donde PostGIS tiene 128, porque el esquema del
tile no sabe de carriles pintados ([0038](decisiones/0038-ciclovias-dibujadas-desde-el-api.md)).

### Cómo se piden

Cuando el mapa deja de moverse, `onRegionDidChange` da el recuadro visible, y
`apps/mobile/lib/cycleways.ts` lo **ajusta a una cuadrícula de 0,02°** —unos dos kilómetros—
antes de pedirlo:

```
recuadro visible   -77.034…, -12.091…   →   ajustado   -77.04, -12.10
```

Mover el mapa un poco no cambia la clave de la consulta, así que TanStack Query responde de su
caché en vez de salir a la red con la señal intermitente de la calle. El `staleTime` de esa
consulta es de **una hora**: la red ciclista cambia cuando alguien corre `osm:update`, no mientras
pedaleás.

Del lado del API, `findCyclewaysInBbox` devuelve **GeoJSON ya armado**, simplificado con una
tolerancia de unos dos metros y con tope de 5000 tramos. El móvil se lo pasa a MapLibre tal cual,
sin traducir nada.

## La brújula, paso a paso

Es la pieza con más trampas, así que va entera.

```
magnetómetro + acelerómetro
        │  Android fusiona y compensa la inclinación
        ▼
Location.watchHeadingAsync   { trueHeading, magHeading, accuracy }
        │  se guarda el rumbo crudo en un ref
        ▼
tick de 50 ms  →  smoothHeadingDegrees(anterior, crudo, 0.2)
        │  filtro paso bajo, en seno y coseno
        ▼
grados redondeados  →  icon-rotate del cono en MapLibre
```

**1. De dónde sale el rumbo.** No se lee el magnetómetro crudo: el sistema ya fusiona sensores y
—esto es lo que importa— **compensa la inclinación del teléfono**, que en el portacelular va a
unos 45°. Sin esa compensación el rumbo miente justo en la postura en que se usa
([0025](decisiones/0025-brujula-heading-fusionado.md)).

**2. `trueHeading` vale `-1`** mientras no haya un fix del GPS con el que calcular la declinación
magnética. Cuando pasa, se cae al norte magnético: en Lima la diferencia es de un par de grados y
en el cono no se nota.

**3. El filtro avanza en un tick, no con cada lectura.** Android deja de emitir en cuanto el rumbo
se estabiliza. Si el filtro solo corriera con cada lectura, al terminar de girar se quedaría
clavado unos diez grados antes del rumbo real, y ahí se moriría. Con el tick converge: un giro de
90° se asienta en algo más de un segundo.

**4. El suavizado es en el círculo.** Promediar ángulos como números falla al cruzar el norte:
entre 359° y 1° la media aritmética da 180° y la flecha pega la vuelta entera. `smoothHeadingDegrees`
en `packages/geo` promedia seno y coseno y recompone con `atan2`.

**5. El mando a ajustar es uno solo**: `HEADING_SMOOTHING`, hoy `0.2`. Más peso tiembla, menos peso
va con retraso. Se afina pedaleando.

### Cuando la brújula no está

| Situación | Cómo se detecta | Qué se ve |
|---|---|---|
| Teléfono sin magnetómetro | No llega ninguna lectura en 6 s | «Este teléfono no tiene brújula» y no se dibuja el cono |
| Brújula descalibrada | El nivel que reporta Android baja de 2 | «Mové el teléfono dibujando un ocho en el aire» |
| Permiso de ubicación denegado | La respuesta del diálogo | «Sin permiso de ubicación no se puede mostrar dónde estás» |

Lo de las 6 segundos y el margen de 12 lecturas antes de pedir calibrar no son caprichos: sin
magnetómetro el sensor **no falla, simplemente calla**, y Android arranca el nivel de calibración
en 0 aunque esté bien.

### Cómo se dibuja

`apps/mobile/components/rider-puck.tsx` pone cuatro capas de MapLibre sobre el mismo punto:

```
círculo de precisión   radio en píxeles calculado desde los metros del GPS
cono                   PNG con degradado, girado por icon-rotate
halo blanco            para que el punto se lea sobre cualquier fondo
punto azul             vos
```

El cono está alineado **al mapa** y no a la pantalla, así que el día que el mapa rote al grabar,
el cono va a seguir apuntando al norte magnético correcto sin tocar nada.

El azul es deliberado: en este mapa el verde y el ámbar ya significan otra cosa.

## Dónde estoy, y por qué hace falta Google

La posición sale de `Location.watchPositionAsync` de `expo-location`, cada cinco metros. Y ahí hay
un límite que conviene conocer antes de que aparezca en la calle.

**`expo-location` en Android pide la posición solo a Google Play Services.** Su módulo nativo
declara un `FusedLocationProviderClient` y lo obtiene con `LocationServices.getFusedLocationProviderClient(...)`.
No comprueba si Play Services está y no cae a ningún otro proveedor.

En un teléfono sin GMS —un Huawei posterior a 2019, por ejemplo— eso **no falla: calla**. No llega
ninguna posición, no se lanza ningún error, y la app se queda sin punto azul sin poder explicar
por qué. Comprobado en un Huawei Y7p con Android 10.

Dos consecuencias que no son obvias:

- **La brújula sigue funcionando** en ese teléfono. El rumbo sale de `SensorManager` directo, sin
  pasar por Google. Ver el cono girar y no ver el punto es exactamente el síntoma.
- **`hasServicesEnabledAsync()` no sirve para detectarlo.** Consulta el `LocationManager` del
  sistema, que está encendido. Diría que todo está bien.

**Existe una salida y no está tomada.** MapLibre trae su propio motor de ubicación: su
`DefaultLocationEngineProvider` usa `LocationEngineDefault`, que devuelve
`MapLibreFusedLocationEngineImpl`, y esa clase solo referencia `android.location.LocationManager`
— el proveedor del sistema, sin nada de Google. Como MapLibre ya está instalada para dibujar el
mapa, cambiar la fuente de posición sería barato. Se dejó fuera a propósito: hoy tupu **requiere
un Android con Google Play Services**, y el disparador para revisarlo está en
[`planeacion.md`](planeacion.md).

Lo mismo va a pasar con la grabación en segundo plano, que también se apoya en `expo-location`
([0015](decisiones/0015-grabacion-en-segundo-plano.md)).

## Los tres modos de cámara

La cámara de MapLibre tiene tres mandos: `center`, `zoom` y `bearing` —hacia dónde apunta el borde
de arriba de la pantalla—. Quién los mueve depende del modo
([0039](decisiones/0039-tres-modos-de-camara.md)):

| Modo | `center` | `bearing` |
|---|---|---|
| `free` | Quieto | Solo los dos dedos |
| `follow` | El ciclista | `0`, norte arriba |
| `follow-heading` | El ciclista | El rumbo suavizado de la brújula |

`useFollowCamera` (`lib/camera.ts`) guarda lo último que le mandó a la cámara y solo vuelve a
mandar si el punto cambió o si el rumbo giró más de 3°. Sin ese umbral llegarían veinte
animaciones por segundo, porque el filtro de la brújula entrega un valor cada 50 ms.

### El gesto propio no se distingue solo

Para salir del modo hace falta saber si el mapa se movió por un dedo o por nosotros, y el campo
obvio miente. En Android, `userInteraction` vale `true` **también para nuestras propias
animaciones** — `CameraChangeTracker` cuenta `DEVELOPER_ANIMATION` como interacción. Si se usara
tal cual, el seguimiento se apagaría solo en el primer movimiento.

Lo que separa los dos casos es el otro campo del evento:

| Origen | `userInteraction` | `animated` |
|---|---|---|
| Un dedo | `true` | `false` |
| Nuestro `easeTo` | `true` | `true` |
| Animación interna del SDK | `false` | `true` |

Así que un gesto es `userInteraction && !animated`. En iOS no hace falta, porque ahí se enmascara
lo programático, pero el MVP es Android ([0019](decisiones/0019-mvp-solo-android.md)).

## El API por dentro

Cada funcionalidad es una carpeta con las mismas cuatro piezas
([0008](decisiones/0008-apps-api-por-funcionalidad.md)):

```
features/cycleways/
  routes.ts    la ruta HTTP y su validación. Nada más
  queries.ts   PostGIS
  schema.ts    las tablas de Drizzle
  index.ts     lo único que otra feature puede importar
```

### Las rarezas de PostGIS que hay que conocer

- **`::geography`, no `::geometry`.** En 4326 las distancias de `geometry` salen en **grados**, así
  que un radio de 1000 daría la vuelta al planeta.
- **El índice GiST va sobre la expresión `(geom::geography)`**, no sobre la columna pelada. Todas
  las consultas castean, y con el índice sobre `geometry` el planificador hacía `Seq Scan`. Está
  verificado con `EXPLAIN`.
- **`ST_DWithin`, no `ST_Distance(...) < r`.** El segundo no usa el índice.

### El perfil ciclista

`features/routing/service.ts` traduce «ruta de bici en Lima» a números de Valhalla:

```ts
bicycle_type: 'Hybrid',  cycling_speed: 18,
use_roads: 0.2,          // huir de las avenidas
use_hills: 0.2,          // huir de las cuestas
avoid_bad_surfaces: 0.5,
```

Esos dos `0.2` por debajo del defecto son la premisa de la app, no un ajuste tímido: rutas más
largas y más tranquilas ([0029](decisiones/0029-perfil-ciclista-de-valhalla.md)). Están puestos a
ojo y hay que afinarlos desde la primera salida.

`use_hills` solo hace algo si el grafo se construyó **con** los tiles de elevación. Si esa carpeta
está vacía, el parámetro no falla: se ignora en silencio.

### Los errores

Todo fallo sale con la misma forma, y el móvil distingue por el código:

| Código | HTTP | Cuándo |
|---|---|---|
| `bad_request` | 400 | La validación de Zod rechazó la petición |
| `upstream_unavailable` | 503 | Valhalla o PostGIS no respondieron |
| `internal` | 500 | Cualquier otra cosa |

Que Valhalla caído dé 503 y no 500 es lo que permite que la app diga «el servidor no está» en vez
de «no hay ruta».

## Los contratos

`packages/contracts` son esquemas de Zod, y de ellos salen **los tipos y la validación a la vez**
([0032](decisiones/0032-zod-en-contracts.md)). Un cambio ahí toca el API y el móvil al mismo
tiempo, por eso esos commits van solos.

El cliente del móvil es el RPC de Hono tipado con `AppType`, así que renombrar un campo en el API
rompe la compilación del móvil en vez de romper la app en la calle.

## Lo que corre en producción

Un solo proyecto de Dokploy con tres contenedores; solo el API sale a internet. Está todo en
[`infra/README.md`](../infra/README.md), incluido cómo construir el grafo en el VPS.
