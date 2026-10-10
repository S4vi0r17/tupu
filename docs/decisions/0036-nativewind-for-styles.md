# 0036 — NativeWind para los estilos del móvil

Aceptada · 2026-09-09

## Contexto

Nunca se decidió cómo se escriben los estilos del móvil; por defecto quedaba `StyleSheet.create`.
La preferencia es Tailwind: escala consistente e iteración rápida.

## Decisión

NativeWind `5.0.0-preview.4` con Tailwind 4.

```
apps/mobile/global.css        @import tailwindcss + tema de NativeWind
apps/mobile/babel.config.js   preset nativewind/babel
apps/mobile/metro.config.js   withNativewind(config, { globalClassNamePolyfill: true })
```

La 5 y no la 4.2.6 estable: la 4 depende de `react-native-css-interop`, que fija Tailwind 3.

Biome ordena las clases con `useSortedClasses`, sin traer Prettier.

## Se paga

- Es un preview, con cuatro meses sin publicar cuando se adoptó.
- Su guía apunta a Expo SDK 54; acá se usa la 57.
- Suma `react-native-worklets` y transforms sobre la configuración de Metro.
- Sin estas tres piezas compila, arranca y no aplica ninguna clase, sin error:
  1. `postcss.config.js` con `@tailwindcss/postcss`.
  2. `projectRoot` explícito en `withNativewind`, por el monorepo.
  3. `lightningcss` fijado en `1.30.1` con `overrides`: con la 1.33 de la SDK 57 falla.
- `@source` no funciona; las fuentes se detectan con `projectRoot`.
- Al mapa no le sirve: MapLibre se estiliza con capas.

La única prueba válida es verlo en pantalla: el nombre de una clase en el bundle no demuestra nada.

## Descartado

- **Tokens tipados y `StyleSheet`.** Cero dependencias, pero sin variantes, modo oscuro ni estados.
- **NativeWind 4.2.6.** Atada a Tailwind 3 y suma `react-native-reanimated`.
- **`StyleSheet` a secas.** Lento, y la escala se termina inventando.
