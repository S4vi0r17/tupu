# tupu

App móvil + backend para ciclistas en Lima: planificar rutas sobre la red de ciclovías,
saber cuánto se tarda de un punto a otro, ver alternativas, contar kilómetros y llevar el
historial de recorridos. La app incluye una brújula que indica hacia dónde apunta
físicamente el teléfono sobre el mapa.

> **Estado: en el aire y andando.** El lado servidor está desplegado, y la app muestra el mapa con
> la red ciclista de Lima, dónde estás y hacia dónde miras. Falta dibujar la ruta en pantalla y
> grabar el recorrido. Las 38 decisiones que definen el MVP están tomadas.
>
> Para entender cómo funciona, [`docs/como-funciona.md`](docs/como-funciona.md); para saber qué
> comando corre qué, [`docs/comandos.md`](docs/comandos.md). El stack de un vistazo, con las
> alternativas descartadas en cada capa, en [`docs/stack.md`](docs/stack.md); el razonamiento de
> cada decisión en [`docs/decisiones/`](docs/decisiones/); el estado y lo aplazado, en
> [`docs/planeacion.md`](docs/planeacion.md). Las palabras raras están en
> [`docs/glosario.md`](docs/glosario.md), las entidades en
> [`docs/modelo-datos.md`](docs/modelo-datos.md), y cómo se escribe el código en
> [`docs/conventions/`](docs/conventions/). Si trabajas con un agente de IA, el índice para él está
> en [`AGENTS.md`](AGENTS.md).

## Cómo se levanta

```sh
bun install
cp apps/api/.env.example apps/api/.env          # falta la base: ver infra/
cp apps/mobile/.env.example apps/mobile/.env    # con la IP de tu red local

bun run check            # lint y tipos, lo mismo que corre el hook de pre-push
bun run infra:up         # PostGIS en docker
bun run db:migrate       # tablas y extensiones
bun run osm:update       # ciclovías y grafo de ruteo, la primera vez tarda
bun run dev:api          # API en el puerto 3001
```

La app no corre en Expo Go, porque MapLibre lleva código nativo
([0005](docs/decisiones/0005-expo-en-el-movil.md)). Hace falta una build de desarrollo propia, que
con el SDK de Android instalado se compila local:

```sh
bun run --filter '@tupu/mobile' prebuild   # genera android/, que no se versiona
bun run --filter '@tupu/mobile' android    # compila e instala en el teléfono conectado
bun run dev:mobile                         # el servidor de Metro, una vez instalada
```

Para un APK que ande solo, sin Metro detrás:

```sh
apps/mobile/android/gradlew -p apps/mobile/android assembleRelease
```

Ojo con `EXPO_PUBLIC_API_URL` de `apps/mobile/.env` antes de compilarlo: esa URL se hornea dentro
del APK. Todos los comandos, con sus trampas, en [`docs/comandos.md`](docs/comandos.md).

Lo que corre del lado servidor vive en [`infra/`](infra/), desplegado en Dokploy.

## El repositorio

```
apps/api             el servidor: Hono sobre Bun, ordenado por funcionalidad
apps/mobile          la app: Expo Router
packages/contracts   qué se manda y qué se recibe, en esquemas de Zod
packages/geo         matemática geográfica, sin red ni base de datos
infra/               docker, base de datos y motor de ruteo
docs/                decisiones, convenciones y modelo de datos
```

`apps/*` importa de `packages/*` y nunca al revés; las apps no se importan entre sí. Lo hace
cumplir Biome, y las reglas están verificadas rompiéndolas a propósito
([0002](docs/decisiones/0002-layout-del-repo.md), [0031](docs/decisiones/0031-biome-para-lint-y-formato.md)).

## De dónde sale

El punto de partida es un prototipo de una sola página —`~/Downloads/ciclovias-lima-osm (1).html`—
que pinta con Leaflet las ciclovías de Lima consultando la Overpass API de OpenStreetMap en vivo.
Sirvió para confirmar que los datos existen y son utilizables. Sus límites son justo lo que este
proyecto viene a resolver: no calcula rutas, no guarda nada, y depende de servidores públicos que
se saturan.

> **En pausa desde el 2026-09-10.** El trabajo sigue en
> [`LagartoSoft/chasqui`](https://github.com/LagartoSoft/chasqui) —
> [por qué](docs/decisiones/0041-tupu-en-pausa-sigue-chasqui.md).

## El MVP

La primera versión son cuatro cosas, y ninguna más ([0010](docs/decisiones/0010-alcance-del-mvp.md)):
el mapa con las ciclovías resaltadas, una ruta en bici entre dos puntos con su distancia y tiempo,
la grabación del recorrido guardada en el teléfono, y la brújula —el cono que muestra hacia dónde
miras, con un botón que hace que el mapa te siga y rote
([0039](docs/decisiones/0039-tres-modos-de-camara.md)). Sin cuentas y solo en Android
**con Google Play Services**: sin ellos no hay ubicación, y esos teléfonos van a tener una app
aparte ([0040](docs/decisiones/0040-app-aparte-para-telefonos-sin-google.md)). El porqué está en
[`docs/como-funciona.md`](docs/como-funciona.md).

Lo que se valida con eso es lo único que de verdad importa al principio: **si el motor de ruteo da
rutas ciclistas decentes en Lima.** Si eso sale mal, el resto no importa.

## Qué se quiere construir, entero

- Planificar una ruta entre dos puntos con perfil de bicicleta, priorizando ciclovías.
- Rutas alternativas, con su distancia y tiempo estimado para comparar.
- Historial de recorridos: tiempo real empleado, kilómetros, trazado seguido.
- Brújula: un indicador de hacia dónde mira físicamente el teléfono, reflejado en el mapa.
- Funcionar con señal intermitente, que es lo normal pedaleando.
