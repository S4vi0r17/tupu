# Cómo funciona

De OpenStreetMap a la pantalla. El porqué de cada pieza está en las [decisiones](decisions/).

## El recorrido de un dato

Dos caminos que salen de la misma descarga, para que el mapa no muestre una ciclovía por la que
el motor no sabe rutear (0020).

```
                Geofabrik: peru-latest.osm.pbf (245 MB)
                               │
                  osm:update, a mano, unos 20 min
                ┌──────────────┴──────────────┐
                ▼                             ▼
      osmium filtra ciclovías        valhalla_build_tiles
      ogr2ogr las carga              construye el grafo
                ▼                             ▼
      PostGIS: cycleways             Valhalla: /data/tiles
                │                             │
      GET /v1/cycleways              POST /v1/routing/plan
                ▼                             ▼
      GeoJSON                        polilínea, metros, segundos
                └──────────────┬──────────────┘
                               ▼
                     apps/mobile: MapLibre
```

## La ingesta

`infra/osm/update.sh` corre `apps/api/src/features/cycleways/ingest.ts`:

1. `osmium` se queda con las vías etiquetadas como infraestructura ciclista.
2. `ogr2ogr` las carga en una tabla cruda.
3. Un `insert ... select` las reduce a tres clases y reemplaza la tabla en una transacción.
4. Si la red queda en menos de la mitad que la corrida anterior, se revierte.

Cada corrida deja en `osm_imports` la fecha del extracto y cuántos tramos entraron.

| `kind` | Qué es | Cómo se dibuja |
|---|---|---|
| `track` | Vía propia, separada del tráfico | Verde continuo con halo blanco |
| `lane` | Carril pintado en la calzada | Verde punteado, más fino |
| `shared` | Asfalto compartido con autos | Ámbar punteado |

## El mapa

El fondo son tiles de OpenFreeMap, una URL en `MAP_STYLE_URL` (0016). La red ciclista va encima,
desde el API: el tile no distingue carriles pintados y en el Centro traía 4 tramos donde PostGIS
tiene 128 (0038).

La red se pide entera una vez por sesión: 2338 tramos, 84 KB con gzip (0041). El API la manda
simplificada a dos metros y con cinco decimales.

## La brújula

```
magnetómetro + acelerómetro
        │  Android los fusiona y compensa la inclinación
        ▼
watchHeadingAsync  →  rumbo crudo
        ▼
cada 50 ms: smoothHeadingDegrees(anterior, crudo, 0.2)
        ▼
icon-rotate del cono
```

- El rumbo del sistema compensa la inclinación del portacelular; el magnetómetro crudo no (0025).
- `trueHeading` vale -1 hasta el primer fix del GPS. Mientras tanto se usa el magnético: en Lima
  difieren un par de grados.
- El filtro avanza por reloj y no por lectura, porque Android deja de emitir cuando el rumbo se
  queda quieto y el cono se clavaría antes de llegar.
- Se promedian seno y coseno: la media de 359° y 1° en grados da 180°.
- El único valor a afinar es `HEADING_SMOOTHING`. Más alto tiembla; más bajo va con retraso.

| Situación | Cómo se detecta | Qué ve el usuario |
|---|---|---|
| Sin magnetómetro | Ninguna lectura en 6 s | Aviso, y no se dibuja el cono |
| Descalibrada | Nivel de Android menor a 2, tras 12 lecturas | Pedido de mover el teléfono en ocho |
| Sin permiso de ubicación | Respuesta del diálogo | Aviso |

El cono se alinea al mapa y no a la pantalla, así gira con él en `follow-heading`.

## La posición

`watchPositionAsync` de `expo-location`, cada cinco metros. En Android pide la posición solo a
Google Play Services: sin ellos no hay error, solo silencio. La brújula sí funciona, porque no
pasa por Google. `hasServicesEnabledAsync()` no lo detecta.

El `LocationManager` de MapLibre no depende de Google, pero solo funciona en primer plano, y la
voz y la grabación necesitan la pantalla apagada. Por eso la app requiere Google Play Services
(0040).

## La cámara

| Modo | Centro | Rumbo del mapa |
|---|---|---|
| `free` | Quieto | Solo con dos dedos |
| `follow` | El ciclista | Norte arriba |
| `follow-heading` | El ciclista | El de la brújula |

`useFollowCamera` solo mueve la cámara si el punto cambió o el rumbo giró 3° o más. Sin umbral
serían veinte animaciones por segundo.

Cualquier gesto vuelve a `free`. En Android, `userInteraction` es `true` también en nuestras
animaciones; lo que distingue al dedo es `animated: false`.

## El API

Una carpeta por funcionalidad (0008):

```
features/cycleways/
  routes.ts    ruta HTTP y validación
  queries.ts   PostGIS
  schema.ts    tablas de Drizzle
  index.ts     lo único que otra feature puede importar
```

En SRID 4326, `geometry` mide en grados: las distancias se calculan con `::geography`. El índice
GiST está sobre esa expresión; sobre la columna, el planificador hacía `Seq Scan`.

`features/routing/service.ts` lleva el perfil ciclista:

```ts
bicycle_type: 'Hybrid', cycling_speed: 18,
use_roads: 0.2,   // lejos de las avenidas
use_hills: 0.2,   // lejos de las subidas
avoid_bad_surfaces: 0.5,
```

Están puestos a ojo (0029). `use_hills` solo funciona si el grafo se construyó con elevación; si
no, se ignora sin avisar.

| Código | HTTP | Cuándo |
|---|---|---|
| `bad_request` | 400 | Zod rechazó la petición |
| `upstream_unavailable` | 503 | Valhalla o PostGIS no respondieron |
| `internal` | 500 | Cualquier otra cosa |

## Contratos

`packages/contracts` son esquemas de Zod: dan la validación y el tipo a la vez (0032). El móvil
usa el cliente RPC de Hono tipado con `AppType`, así que renombrar un campo en el API rompe la
compilación del móvil (0004).

## Producción

Un proyecto de Dokploy con API, PostGIS y Valhalla. Solo el API sale a internet. Detalle en
[`infra/README.md`](../infra/README.md).
