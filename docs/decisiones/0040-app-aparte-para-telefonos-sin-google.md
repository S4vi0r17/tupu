# 0040 — Los teléfonos sin Google Play Services van en una app aparte

**Estado:** Aceptada · 2026-09-10

## Contexto

`expo-location` en Android le pide la posición solo al proveedor fusionado de Google, sin
comprobar si existe y sin caer a ningún otro. En un teléfono sin GMS no falla: **calla**.
Comprobado en un Huawei Y7p con Android 10, donde la brújula sí funciona porque el rumbo no pasa
por Google.

Hasta hoy eso costaba el punto azul. Con [0039](0039-tres-modos-de-camara.md) cuesta más: los
tres modos de cámara siguen una posición que en ese teléfono nunca llega, así que el botón se ve,
se toca y el mapa no se mueve. Cada cosa que se apoye en la posición hereda el mismo agujero.

Había dos salidas, y la barata resultó ser la cara:

**Arreglar tupu por dentro.** MapLibre —que ya está instalada para dibujar el mapa— expone un
`LocationManager` en JS con `addListener`, `start()` y `requestPermissions()`, y entrega latitud,
longitud y precisión: los tres datos que `useCurrentLocation` ya devuelve. Es reescribir un
archivo, unas sesenta líneas.

El problema aparece después. **Ese motor es solo de primer plano.** La grabación del recorrido
está decidida con `expo-location` en segundo plano ([0015](0015-grabacion-en-segundo-plano.md)),
y eso no se puede mover. La app quedaría con **dos fuentes de posición conviviendo**: dos caminos
de permisos, dos conjuntos de manías por Android, y un día un punto que salta entre las dos sin
que nadie pueda reproducirlo, porque dependerá de cuál contestó primero.

## Decisión

**Una segunda app móvil, en su propio repositorio**, más compatible y más minimalista: mapa, red
ciclista y dónde estoy. Sin grabación, sin SQLite, sin permiso de ubicación «siempre».

`tupu` se queda exactamente como está —`expo-location`, Google Play Services, el MVP completo— y
no se llena de condicionales por un teléfono que no es el suyo.

**El servidor no se toca.** El API no sabe qué teléfono lo llama: mismo endpoint de ciclovías,
mismo endpoint de ruta, mismo despliegue ([0009](0009-despliegue-en-dokploy.md)). Lo caro ya está
hecho y sirve para las dos.

| | `tupu` | La app compatible |
|---|---|---|
| Posición | `expo-location`, vía Google | `LocationManager` de MapLibre, vía el sistema |
| Segundo plano | Sí, para grabar | No |
| Grabación e historial | Sí | No |
| Mapa y red ciclista | Iguales | Iguales |
| API | El mismo | El mismo |

## Consecuencias

**A favor**

- **Ninguna app carga con las manías de la otra.** `tupu` graba en segundo plano sin un solo `if`;
  la otra no graba y no lo necesita.
- **El alcance de la segunda es chico de verdad**, no «el MVP menos cosas». Se puede terminar.
- **Lo caro ya está desplegado.** El API, PostGIS, Valhalla y el `osm:update` sirven igual.
- Se puede verificar en el Y7p que ya está a mano, que es lo que ninguna decisión de escritorio
  puede dar.

**En contra**

- **Los paquetes compartidos dejan de ser gratis.** `packages/contracts` y `packages/geo` son
  workspaces de Bun (`workspace:*`), y otro repositorio no los resuelve
  ([0001](0001-monorepo-con-bun.md), [0002](0002-layout-del-repo.md)). Hay tres salidas
  —publicarlos, apuntarlos por git, o copiarlos y asumir la deriva— y ninguna está elegida.
  **Disparador: cuando arranque la segunda app**, no antes.
- **Dos apps que mantener.** Un cambio de contrato en el API hay que llevarlo a dos sitios, y el
  día que se olvide una, se entera el usuario.
- **Dos APKs, dos keystores**, y dos entradas en EAS cuando llegue ([0005](0005-expo-en-el-movil.md)).
- **Alguien tiene que saber cuál instalar.** Repartir el APK a mano ya era manual; ahora además
  hay que preguntar qué teléfono tiene.

## Alternativas descartadas

- **Dos fuentes de posición dentro de `tupu`** — MapLibre en primer plano, `expo-location` en
  segundo. Un archivo de trabajo, y el punto azul andaría en el Huawei mañana. Se descartó por lo
  que deja atrás: dos caminos de permisos y un bug futuro que dependerá de cuál de las dos fuentes
  contestó primero, que es la clase de error que no se reproduce.
- **Cambiar `tupu` entera al `LocationManager` de MapLibre.** Una sola fuente, limpio. Se descartó
  porque se pierde el segundo plano, y con él la grabación — que es el punto 3 del MVP
  ([0010](0010-alcance-del-mvp.md), [0013](0013-recorrido-en-sqlite-local.md)).
- **La segunda app como otra `apps/*` de este monorepo.** Reusaría `contracts` y `geo` gratis, sin
  publicar nada, y el cambio de contrato se vería roto en el `typecheck` en vez de en la calle. Se
  descartó por pedido: repositorio propio, para que la app minimalista no arrastre el peso de este
  repo. Es exactamente lo que se paga en el primer punto de «en contra».
- **No cubrir esos teléfonos.** Es lo que regía hasta hoy. Deja fuera a cualquier Huawei posterior
  a 2019, que en Lima no son pocos.
