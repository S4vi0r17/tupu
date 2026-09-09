# 0036 — NativeWind para los estilos del móvil

**Estado:** Aceptada · 2026-09-09

## Contexto

[0014](0014-expo-router-zustand-tanstack-query.md) fijó navegación, estado y datos del móvil, pero
**nunca se decidió cómo se escriben los estilos**. Por defecto quedaba `StyleSheet.create`, que es
lo que traía el esqueleto.

La preferencia es Tailwind: escala de espaciado y color consistente, e iteración rápida de
interfaz, que en un proyecto donde el diseño importa es trabajo real y repetido.

## Decisión

**NativeWind 5**, en su versión `5.0.0-preview.4`, con Tailwind 4.

```
apps/mobile/global.css      @import tailwindcss + el tema de NativeWind
apps/mobile/babel.config.js preset nativewind/babel
apps/mobile/metro.config.js withNativewind(config, { globalClassNamePolyfill: true })
```

`globalClassNamePolyfill` permite `className` en `View` y `Text` sin envolverlos.

**Por qué la 5 y no la estable.** La 4.2.6 arrastra `react-native-css-interop`, que fija
`tailwindcss ~3`. Elegirla es empezar una versión mayor atrás de Tailwind el mismo día que se
escribe la primera pantalla. La 5 es la que usa Tailwind 4 de verdad.

## Consecuencias

**A favor**

- Escala de diseño consistente sin inventarla, y sin mantener un módulo de tema propio.
- Modo oscuro, consultas de medios y variantes por estado sin escribir la lógica.
- Los estilos se compilan en tiempo de construcción, no en cada render.
- Biome tiene `useSortedClasses`, así que ordenar las clases no obliga a traer Prettier de vuelta
  y [0031](0031-biome-para-lint-y-formato.md) sigue en pie.

**En contra, y hay que tenerlo presente**

- **Es un preview.** El primero salió en septiembre de 2025 y el último en mayo de 2026: cuatro
  meses sin publicar cuando se adoptó. Un fallo propio puede no tener arreglo aguas arriba.
- **Su guía rápida apunta a Expo SDK 54 y acá se usa la 57.** Funciona, pero no es una
  combinación que el proyecto pruebe.
- **Suma `react-native-worklets` y un transform de Babel y Metro** sobre la configuración de Metro
  del monorepo, que [0002](0002-layout-del-repo.md) ya marca como el sitio donde los errores son
  peores de leer.
- **`@source` no funciona.** El parser de CSS de `react-native-css` no lo digiere y falla con
  *failed to deserialize*. Hay que confiar en la detección automática de Tailwind 4.
- **Al mapa no le sirve.** MapLibre se estiliza con especificaciones de capa, no con clases, y el
  mapa es el peso visual de la app. NativeWind rinde en las superposiciones, que son pocas.

**Qué se verificó al adoptarlo**, porque siendo un preview no alcanza con que instale:

- El bundle de Android se construye entero.
- Una clase arbitraria, `bg-[#123456]`, aparece compilada dentro del bundle nativo.
- El `.css` que aparece vacío en la exportación es el artefacto **web**; los estilos nativos van
  dentro del bundle de JavaScript.

## Alternativas descartadas

- **Módulo de tokens tipado más `StyleSheet`** — treinta líneas, cero dependencias, cero
  transforms, y da la consistencia de una escala sin nada más. Era la recomendación. Se descartó
  porque no da variantes, modo oscuro ni estados sin escribirlos a mano, y porque la velocidad de
  iteración en la interfaz es un objetivo explícito del proyecto.
- **NativeWind 4.2.6, la estable** — la opción prudente. Se descartó por quedar atada a Tailwind 3
  y por sumar `react-native-reanimated`, que tampoco es gratis.
- **Seguir con `StyleSheet` a secas** — es lo que había. Se descartó por lo mismo que se abrió la
  discusión: escribir estilos así es lento y la escala se termina inventando dos veces.
