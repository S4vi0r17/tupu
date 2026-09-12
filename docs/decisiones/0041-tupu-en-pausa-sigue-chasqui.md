# 0041 — `tupu` queda en pausa; la línea que sigue es `chasqui`

**Estado:** Aceptada · 2026-09-10
**Reemplaza:** parcialmente a [0040](0040-app-aparte-para-telefonos-sin-google.md), que daba por
hecho que la segunda app usaría este mismo API. No usa ninguno.

## Contexto

[0040](0040-app-aparte-para-telefonos-sin-google.md) decidió una segunda app para los teléfonos
sin Google Play Services, reusando el servidor de `tupu`: *«el API no sabe qué teléfono lo
llama»*. Al medir para construirla, dos números cambiaron el cuadro.

**Primero: la red ciclista entera del Perú son 66 KB.** Medido contra el API en producción — 2320
tramos, 1746 vía propia, 281 carril, 293 compartida, ya simplificados a dos metros y con las
coordenadas a cinco decimales. De esos, 1883 están en Lima y Callao, repartidos en 42 distritos.

PostGIS, Drizzle, las migraciones, la ingesta y el endpoint `in-bbox` existen para **no mandar la
red entera en cada petición**. A 66 KB no hay nada que recortar: la respuesta siempre es «todo», y
«todo» solo cambia cuando alguien corre `osm:update` a mano. Un índice espacial sirve cuando no
podés cargar el libro; si el libro es una postal, te llevás la postal.

**Segundo: la build sin Google anda en todos los Android.** El motor de ubicación de MapLibre usa
`android.location.LocationManager`, que es parte de Android y no de Google. En un teléfono con
Play Services funciona igual — pierde un poco de rapidez en el primer fix y algo de batería,
porque el proveedor de Google mezcla wifi y antenas para adivinar antes de que enganche el GPS.

Con eso, «la app compatible» deja de ser una variante. Es la app.

## Decisión

**`tupu` queda en pausa.** No se borra nada y el API sigue desplegado. Simplemente no se le añade
funcionalidad.

**El trabajo sigue en [`LagartoSoft/chasqui`](https://github.com/LagartoSoft/chasqui)**, repo
propio y separado. Va bajo la organización sin ánimo de lucro; `tupu` es personal y puede
monetizarse más adelante. Distinta casa, distinta licencia, distinto futuro.

`chasqui` **no tiene backend de ninguna clase**: la red ciclista viaja dentro del APK. Sin
Postgres, sin PostGIS, sin Drizzle, sin migraciones, sin Hono, sin Docker, sin VPS, sin Dokploy.

| | `chasqui` tiene | `chasqui` no tiene |
|---|---|---|
| Mapa | Base de OpenFreeMap + la red del Perú en el APK | — |
| Posición | `LocationManager` de MapLibre, del sistema | — |
| Brújula | Cono de visión, suavizado | — |
| Cámara | **Dos** modos: libre ↔ te sigue y gira | El modo intermedio de [0039](0039-tres-modos-de-camara.md) |
| Velocidad | Velocímetro en km/h, suavizado | Distancia, tiempo, promedios |
| Pantalla | No se apaga (`expo-keep-awake`) | — |
| Servidor | — | API, base de datos, despliegue |
| Ruta A→B | — | Necesita Valhalla, y Valhalla necesita servidor |
| Recorridos | — | Grabación, historial, SQLite, cuentas |

## Consecuencias

**A favor**

- **Desaparece el disparador bloqueante de [0030](0030-sin-limite-de-uso-en-el-api.md).** Sin API
  no hay URL horneada en el APK, así que repartirlo ya no publica nada que haya que proteger.
- **Nada que se caiga y nada que pagar.** La app no depende de que un servidor esté vivo.
- **Abre y dibuja sin esperar.** La red está en el teléfono, no al otro lado de la señal de Lima.
- **Un solo APK para todos los Android**, con Google o sin él.

**En contra**

- **Actualizar la red obliga a recompilar y repartir.** Es el precio directo de no tener servidor,
  y va a doler el día que el APK esté en manos de otra gente.
- **El mapa de fondo sigue necesitando señal.** Las ciclovías no, pero el fondo sí; falta
  comprobar en el teléfono qué se ve cuando el estilo no carga.
- **`packages/geo` quedó copiado, no compartido.** Cincuenta líneas duplicadas que van a divergir
  ([0040](0040-app-aparte-para-telefonos-sin-google.md) ya lo anticipaba).
- **La ruta A→B traerá un servidor de vuelta.** Valhalla no entra en un teléfono. «Cero backend»
  vale mientras el alcance sea mapa y posición.
- **Lo que `tupu` tiene a medias envejece**: la grabación decidida en
  [0013](0013-recorrido-en-sqlite-local.md) y [0015](0015-grabacion-en-segundo-plano.md), y el
  perfil ciclista de [0029](0029-perfil-ciclista-de-valhalla.md), que nunca se afinó en la calle.

## Alternativas descartadas

- **Seguir con `tupu` como línea principal y `chasqui` como la variante compatible**, que es lo
  que planteaba [0040](0040-app-aparte-para-telefonos-sin-google.md). Se descartó porque la build
  sin Google anda en todos los teléfonos: la única ventaja que le quedaba a `tupu` son funciones
  que todavía no están escritas.
- **Migrar `tupu` en vez de empezar un repo nuevo.** Menos código duplicado y un solo historial.
  Se descartó por dónde vive cada uno: `chasqui` va en una organización sin ánimo de lucro y
  `tupu` es un proyecto personal que puede monetizarse. Mezclarlos ata dos futuros distintos.
- **Dejar la red ciclista en un servidor mínimo** que sirva el archivo, para poder actualizarla
  sin repartir un APK. Se descartó por pedido: cero servidores. Vuelve a estar sobre la mesa
  cuando llegue el ruteo, que lo necesita igual.
