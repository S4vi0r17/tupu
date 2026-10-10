# Planeación

Hilo de la planeación de `tupu`. Cada decisión se discute, se cierra y se anota en
[`decisiones/`](decisiones/). No se escribe código hasta que la planeación esté cerrada.

> Desde el 2026-09-08 se avanza **en tandas de cuatro decisiones** en vez de una a la vez, a
> pedido, para terminar la planeación más rápido.

Si aparece una palabra que no se entiende, está en el [glosario](glosario.md). Cómo se escribe el
código, en [convenciones](conventions/). Las entidades, en [modelo de datos](modelo-datos.md).

El mapa del stack completo, con las alternativas que se descartaron en cada capa, está en
[`stack.md`](stack.md).

Última sesión: **2026-09-10**.

## Decisiones cerradas

| # | Decisión | Documento |
|---|---|---|
| 1 | Monorepo, con workspaces de **Bun** | [0001](decisiones/0001-monorepo-con-bun.md) |
| 2 | Layout `apps/` · `packages/` · `infra/` · `docs/` | [0002](decisiones/0002-layout-del-repo.md) |
| 3 | Código en inglés, comentarios en español · *sustituida en parte por [0022](decisiones/0022-mensajes-de-commit-en-ingles.md)* | [0003](decisiones/0003-idioma-del-codigo.md) |
| 4 | API con **Hono** sobre Bun | [0004](decisiones/0004-hono-en-el-api.md) |
| 5 | Móvil con **Expo** + MapLibre GL Native | [0005](decisiones/0005-expo-en-el-movil.md) |
| 6 | Ruteo con **Valhalla** self-hosted | [0006](decisiones/0006-valhalla-para-ruteo.md) |
| 7 | Acceso a datos con **Drizzle** | [0007](decisiones/0007-drizzle-para-acceso-a-datos.md) |
| 8 | `apps/api` se organiza **por funcionalidad** | [0008](decisiones/0008-apps-api-por-funcionalidad.md) |
| 9 | Despliegue en **Dokploy** sobre un VPS | [0009](decisiones/0009-despliegue-en-dokploy.md) |
| 10 | Alcance del **MVP**: mapa, ruta, grabación local y brújula · *la brújula redefinida por [0027](decisiones/0027-brujula-muestra-hacia-donde-miras.md), ampliado por [0040](decisiones/0040-alcance-con-voz-y-solo-con-google.md)* | [0010](decisiones/0010-alcance-del-mvp.md) |
| 11 | **PostGIS** desde el inicio | [0011](decisiones/0011-postgis-desde-el-inicio.md) |
| 12 | Ingesta de OSM por **extracto**, a mano | [0012](decisiones/0012-ingesta-de-osm-por-extracto.md) |
| 13 | El recorrido se guarda en **SQLite** en el teléfono | [0013](decisiones/0013-recorrido-en-sqlite-local.md) |
| 14 | **Expo Router + Zustand + TanStack Query** en el móvil | [0014](decisiones/0014-expo-router-zustand-tanstack-query.md) |
| 15 | Grabación en segundo plano con **expo-location** | [0015](decisiones/0015-grabacion-en-segundo-plano.md) |
| 16 | Tiles del mapa: **OpenFreeMap** en el MVP | [0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md) |
| 17 | **Backups aplazados**, disparador: la primera cuenta | [0017](decisiones/0017-backups-aplazados-con-disparador.md) |
| 18 | **Sin staging**: solo producción y local | [0018](decisiones/0018-sin-entorno-de-pruebas.md) |
| 19 | El MVP es **solo Android** | [0019](decisiones/0019-mvp-solo-android.md) |
| 20 | Datos de OSM: **un solo comando** actualiza PostGIS y Valhalla | [0020](decisiones/0020-actualizacion-de-datos-en-un-comando.md) |
| 21 | **GitHub**, rama por funcionalidad y pull request | [0021](decisiones/0021-github-rama-por-funcionalidad.md) |
| 22 | Mensajes de commit **en inglés**, Conventional Commits | [0022](decisiones/0022-mensajes-de-commit-en-ingles.md) |
| 23 | **Sin CI**: Dokploy despliega al mergear | [0023](decisiones/0023-sin-ci-dokploy-despliega.md) |
| 24 | **Sin tests** durante el MVP | [0024](decisiones/0024-sin-tests-durante-el-mvp.md) |
| 25 | Brújula: rumbo fusionado del sistema, suavizado en el círculo | [0025](decisiones/0025-brujula-heading-fusionado.md) |
| 26 | Las ciclovías se dibujan **desde el tile** | [0026](decisiones/0026-ciclovias-dibujadas-desde-el-tile.md) |
| 27 | La brújula muestra **hacia dónde miras**, no el destino · *la rotación redefinida por [0039](decisiones/0039-tres-modos-de-camara.md)* | [0027](decisiones/0027-brujula-muestra-hacia-donde-miras.md) |
| 28 | Destino: **tocar el mapa o pegar coordenadas** | [0028](decisiones/0028-destino-por-mapa-o-coordenadas.md) |
| 29 | Perfil ciclista: **prioriza ciclovía, evita cuestas** | [0029](decisiones/0029-perfil-ciclista-de-valhalla.md) |
| 30 | **Sin límite de uso** en el API, con disparador | [0030](decisiones/0030-sin-limite-de-uso-en-el-api.md) |
| 31 | **Biome** para lint y formato | [0031](decisiones/0031-biome-para-lint-y-formato.md) |
| 32 | **Zod** para validar y definir los contratos | [0032](decisiones/0032-zod-en-contracts.md) |
| 33 | **Drizzle también en el teléfono** | [0033](decisiones/0033-drizzle-tambien-en-el-telefono.md) |
| 34 | El proyecto se llama **tupu** | [0034](decisiones/0034-el-proyecto-se-llama-tupu.md) |
| 35 | ~~Bun instala con enlazador plano~~ — reemplazada por [0037](decisiones/0037-bun-se-queda-con-el-enlazador-aislado.md) | [0035](decisiones/0035-bun-instala-con-enlazador-plano.md) |
| 36 | **NativeWind** para los estilos del móvil | [0036](decisiones/0036-nativewind-para-los-estilos.md) |
| 37 | Bun se queda con el **enlazador aislado** · *el móvil ya no puede ni resolver el cliente de Postgres* | [0037](decisiones/0037-bun-se-queda-con-el-enlazador-aislado.md) |
| 38 | Las ciclovías se dibujan **desde el API** · *sustituye a [0026](decisiones/0026-ciclovias-dibujadas-desde-el-tile.md), sustituida en parte por [0041](decisiones/0041-red-ciclista-en-una-sola-peticion.md)* | [0038](decisiones/0038-ciclovias-dibujadas-desde-el-api.md) |
| 39 | La cámara tiene **tres modos**, y un botón los cicla · *sustituye en parte a [0027](decisiones/0027-brujula-muestra-hacia-donde-miras.md)* | [0039](decisiones/0039-tres-modos-de-camara.md) |
| 40 | El MVP suma **voz, velocímetro y pantalla encendida**, y requiere Google Play Services · *sustituye en parte a [0010](decisiones/0010-alcance-del-mvp.md)* | [0040](decisiones/0040-alcance-con-voz-y-solo-con-google.md) |
| 41 | La red ciclista se pide **entera, una vez** · *sustituye en parte a [0038](decisiones/0038-ciclovias-dibujadas-desde-el-api.md)* | [0041](decisiones/0041-red-ciclista-en-una-sola-peticion.md) |
| — | ~~Alcance: cuentas + historial desde el inicio~~ — reemplazado por [0010](decisiones/0010-alcance-del-mvp.md) | — |
| — | ~~El proyecto se llama rumbo~~ — reemplazado por [0034](decisiones/0034-el-proyecto-se-llama-tupu.md) | — |

## Qué hay en `docs/`

| Documento | Para qué |
|---|---|
| [`como-funciona.md`](como-funciona.md) | El recorrido de un dato de OSM a la pantalla, pieza por pieza |
| [`comandos.md`](comandos.md) | Qué hace cada comando, cuándo se usa y con qué muerde |
| [`stack.md`](stack.md) | El stack de un vistazo, con el rival descartado de cada capa |
| [`decisiones/`](decisiones/) | El razonamiento completo de cada elección y qué se dio a cambio |
| [`modelo-datos.md`](modelo-datos.md) | Las entidades campo por campo, y por qué dos no tienen `id` |
| [`glosario.md`](glosario.md) | Qué es OSM, PostGIS, un tile, una isócrona, un APK… |
| [`conventions/`](conventions/) | Cómo se escriben los commits y los comentarios |
| Este archivo | Estado, orden de arranque, lo aplazado y los huecos |

## Planeación cerrada

**41 decisiones. No queda ninguna abierta.** Cubren stack, datos, móvil, despliegue y proceso, y
los tres huecos que aparecieron al auditar el resultado están cerrados también. El siguiente paso
ya no es decidir: es escribir código.

Lo primero que conviene levantar, en este orden, porque cada paso desbloquea al siguiente:

1. ~~El monorepo vacío con sus workspaces, y el repositorio en GitHub.~~ **Hecho.**
2. ~~`docker compose` con PostGIS y Valhalla, y el comando `osm:update` que llena los dos.~~ **Hecho**, en `infra/`.
3. ~~El API con el endpoint de ciclovías cercanas y el de planificar ruta.~~ **Hecho**, con el
   trato de errores: Valhalla caído devuelve 503 y no un error crudo.
4. ~~La app con el mapa y las ciclovías resaltadas.~~ **Hecho**, dibujadas desde el API.
5. Ruta A→B — **el API la calcula y responde en producción**, así que ya se sabe que el motor da
   rutas ciclistas en Lima. **Falta la pantalla**: elegir destino tocando el mapa
   ([0028](decisiones/0028-destino-por-mapa-o-coordenadas.md)) y dibujar el trazado.
6. Grabación del recorrido y brújula — **la brújula está hecha**: cono de visión y suavizado. **El
   mapa que sigue al ciclista y rota también**, con los tres modos de cámara que decidió
   [0039](decisiones/0039-tres-modos-de-camara.md), probados en la calle. Falta la grabación en sí.
7. ~~Desplegar el lado servidor~~ **Hecho**: los tres contenedores en Dokploy detrás de Traefik, y
   el APK compilado apuntando ahí ([`infra/README.md`](../infra/README.md)).
8. **Voz, velocímetro y pantalla encendida**, sumados al MVP por
   [0040](decisiones/0040-alcance-con-voz-y-solo-con-google.md). La voz va después de la pantalla de
   ruta: anuncia sus maniobras. Lo difícil es detectar que te saliste y recalcular.

## Lo que hay que resolver escribiendo, no decidiendo

Nada de esto necesita discusión, pero conviene no descubrirlo tarde:

- **Licencia del repositorio.** No hay ninguna, y el repo puede acabar siendo público.
- ~~`.env.example` y validar la configuración al arrancar~~ — hecho: `apps/api/src/shared/config.ts`
  valida con Zod y lanza en el arranque, y cada app tiene su `.env.example`.
- **Icono de la app.** El nombre y el `package id` ya están en `apps/mobile/app.json`
  (`pe.tupu.app`, [0034](decisiones/0034-el-proyecto-se-llama-tupu.md)); falta el icono para el APK.
- ~~Cómo se construye la build de desarrollo del móvil~~ — resuelto: `expo prebuild` y
  `expo run:android` en local, con el SDK de Android. El APK que se instala en el teléfono sale
  de `gradlew assembleRelease`, firmado con la clave de depuración que genera Expo. Sirve para
  probar uno mismo y para nada más — ver **EAS Build** en los aplazados.
- ~~Qué hace la app si Valhalla está caído~~ — resuelto en el API: `UpstreamError` se traduce a
  503 con código `upstream_unavailable`, comprobado en producción. **Falta el lado del móvil**,
  que todavía no tiene pantalla de ruta donde mostrarlo.
- ~~El mapa no sigue al ciclista~~ — hecho y **probado en la calle el 2026-09-10**: los tres modos
  de cámara —libre, te sigue, te sigue y gira— que cicla un botón, y cualquier gesto con el dedo
  vuelve a libre ([0039](decisiones/0039-tres-modos-de-camara.md)). Los dos valores que quedaban a
  ojo se dan por buenos: **los 3° de giro y los 300 ms de animación no se tocan.** El gesto propio
  tampoco se confunde con el del dedo, que era el riesgo real.
- **Las etiquetas del mapa rotan con él.** MapLibre puede mantenerlas horizontales y hay que
  configurarlo ([0039](decisiones/0039-tres-modos-de-camara.md)).
- **Mantener la pantalla encendida** en el portacelular
  ([0027](decisiones/0027-brujula-muestra-hacia-donde-miras.md)).
- ~~El estilo del mapa~~ — hecho: vía propia en verde continuo con halo, carril pintado en verde
  punteado y compartida en ámbar punteado ([0038](decisiones/0038-ciclovias-dibujadas-desde-el-api.md)).
- **La pantalla que explica los permisos** de ubicación «siempre»
  ([0015](decisiones/0015-grabacion-en-segundo-plano.md) avisa de que hay que escribirla bien o la
  gente los deniega).

Y dos cosas **a verificar al configurar**, que si fallan cambian una decisión:

- ~~Que `noRestrictedImports` de Biome alcance para la regla fina de
  [0008](decisiones/0008-apps-api-por-funcionalidad.md)~~ — **verificado y alcanza.** Las cuatro
  reglas están en `biome.json` y se comprobaron rompiéndolas a propósito. `patterns` con
  `group` estilo gitignore expresa la regla entre features, y `paths` con `allowImportNames`
  resuelve el único cruce legítimo entre apps: el móvil importa de `@tupu/api` el tipo `AppType`
  y nada más ([0004](decisiones/0004-hono-en-el-api.md)). ESLint queda descartado como salida
  ([0031](decisiones/0031-biome-para-lint-y-formato.md)).
- ~~Que los tiles de OpenFreeMap expongan la infraestructura ciclista de forma distinguible~~ —
  **verificado, con un límite.** Los tiles usan el esquema OpenMapTiles: la vía propia llega como
  `class=path` con `subclass=cycleway`, y trae además los campos `bicycle` y `surface`. Sobre
  Miraflores aparecen con nombre, «Ciclovía Arequipa», «Ciclovía Larco». Lo que **no** expone el
  tile es `cycleway=lane`: un carril pintado solo se distingue si además está etiquetado con
  `bicycle=designated`, y si no, se dibuja como calle común. Ojo con `bicycle=yes`, que significa
  apenas «se permite» y no es infraestructura: filtrarlo por error pinta calles menores y veredas
  como si fueran ciclovías. Ese límite terminó siendo decisivo: sobre el Centro el tile
  traía 4 tramos donde PostGIS tiene 128, así que 0026 quedó sustituida y la red se dibuja desde
  el API ([0038](decisiones/0038-ciclovias-dibujadas-desde-el-api.md)).

## Aplazado, con su disparador

Nada de esto está sin decidir: está decidido que se hace **después**, y cada uno dice cuándo.

| Qué | Cuándo | Dónde |
|---|---|---|
| Backups de la base | **Bloqueante** antes de desplegar la primera cuenta de usuario | [0017](decisiones/0017-backups-aplazados-con-disparador.md) |
| Tests | El primer error de cálculo que llegue a la calle | [0024](decisiones/0024-sin-tests-durante-el-mvp.md) |
| CI en GitHub Actions | El día que haya tests, o que un despliegue roto cueste una tarde | [0023](decisiones/0023-sin-ci-dokploy-despliega.md) |
| Self-host de los tiles del mapa | Cuando llegue el uso sin señal | [0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md) |
| Cron para `osm:update` | Cuando correrlo a mano moleste | [0012](decisiones/0012-ingesta-de-osm-por-extracto.md), [0020](decisiones/0020-actualizacion-de-datos-en-un-comando.md) |
| Entorno de pruebas | Cuando haya gente usando la app | [0018](decisiones/0018-sin-entorno-de-pruebas.md) |
| iOS | Después del MVP | [0019](decisiones/0019-mvp-solo-android.md) |
| **EAS Build con perfiles y scripts**, como el repo hermano `crs-field` | El primer APK que vaya a otra persona, o iOS — lo que llegue antes | [0005](decisiones/0005-expo-en-el-movil.md), [0019](decisiones/0019-mvp-solo-android.md) |
| Ciclovías dibujadas desde el API | Cuando haga falta resaltar un tramo concreto | [0026](decisiones/0026-ciclovias-dibujadas-desde-el-tile.md) |
| `react-native-background-geolocation` | Si `expo-location` resulta poco fiable en la calle | [0015](decisiones/0015-grabacion-en-segundo-plano.md) |
| Geocodificador (buscar por nombre) | Cuando pegar coordenadas moleste, o la use alguien más | [0028](decisiones/0028-destino-por-mapa-o-coordenadas.md) |
| Exponer los mandos del perfil al usuario | Cuando se sepa qué valores son buenos por defecto | [0029](decisiones/0029-perfil-ciclista-de-valhalla.md) |
| Afinar el perfil ciclista | **Desde la primera salida en bici** — los valores actuales están puestos a ojo | [0029](decisiones/0029-perfil-ciclista-de-valhalla.md) |
| Turborepo | Cuando los tests dejen de correr en segundos | [0001](decisiones/0001-monorepo-con-bun.md) |
| **Límite de uso en el API** | **Bloqueante antes de pasarle el APK a otra persona** — el APK lleva la URL dentro, y repartirlo está en el plan de [0019](decisiones/0019-mvp-solo-android.md) | [0030](decisiones/0030-sin-limite-de-uso-en-el-api.md) |

### Por qué tupu hoy necesita Google Play Services

`expo-location` pide la posición al proveedor fusionado de Google, sin comprobar si existe y sin
caer a ningún otro. En un teléfono sin Google Play Services no falla: **calla**, y la app se queda
sin punto azul sin poder decir por qué.

**Es un requisito aceptado, no un pendiente**
([0040](decisiones/0040-alcance-con-voz-y-solo-con-google.md)): la voz y la grabación necesitan la
posición con la pantalla apagada, y eso es lo que da `expo-location` en segundo plano. Los
teléfonos sin Google quedan fuera. El detalle técnico está en [`como-funciona.md`](como-funciona.md).

### Por qué EAS termina entrando

`crs-field` ya tiene el camino hecho: `eas.json` con perfiles `development`, `preview` y
`production`, y scripts que los envuelven (`apk:preview`, `build:prod`, `submit:ios`). Acá se hará
algo parecido, y **no solo por iOS**: lo que hoy falta para producción es la firma. El
`assembleRelease` de ahora usa la clave de depuración, y en Android **un APK firmado con otra
clave no se instala encima del anterior** — hay que desinstalar, y con eso se va el historial de
recorridos que vive en SQLite en el teléfono ([0013](decisiones/0013-recorrido-en-sqlite-local.md)).

Por eso el disparador es el primer APK que salga de las manos de quien lo desarrolla: ahí hay que
tener un keystore que no cambie nunca más, y EAS es quien lo guarda. Cae junto al límite de uso
del API ([0030](decisiones/0030-sin-limite-de-uso-en-el-api.md)), que tiene el mismo disparador.

## Fuera del MVP, sin decidir todavía

Se decidirán cuando toque, no antes ([0010](decisiones/0010-alcance-del-mvp.md)).

- **Cuentas y sincronización** — autenticación (formato de token, refresco, cierre de sesión) y
  cómo se suben al servidor los recorridos guardados en el teléfono. El análisis del token ya está
  hecho: empezar con token opaco en base y cambiar después no cierra ninguna puerta.
- **Rutas alternativas**, para comparar distancia y tiempo. Valhalla ya sabe darlas.
- **Uso sin señal** — qué se guarda del mapa y cuánto pesa.
- **Qué se cachea del motor de ruteo** y por cuánto tiempo.
- **Distribución de la app** más allá de repartir el APK a mano.
- **Traer `naming.md` y `tests.md`** del repo hermano, si hacen falta.
