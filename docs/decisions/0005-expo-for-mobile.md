# 0005 — Expo + MapLibre en el móvil

Aceptada · 2026-09-08

## Contexto

La app necesita mapa, GPS continuo y el magnetómetro para saber hacia dónde apunta el teléfono.

## Decisión

Expo con MapLibre para el mapa.

Con Expo, el móvil y el API comparten lenguaje y `packages/` (0002, 0004). Ubicación y sensores
están en los módulos de Expo.

MapLibre da tiles vectoriales sin cuota, control del estilo por capa (resaltar ciclovías es el
producto) y zonas guardadas para usar sin señal.

## Se paga

- MapLibre no corre en Expo Go: hace falta una build propia, y otra con cada librería nativa.
- Se depende del calendario de Expo para actualizar React Native.
- El magnetómetro es ruidoso: hay que suavizarlo (0025).

## Descartado

- **Flutter.** Mejor rendimiento, pero Dart obligaría a generar los tipos compartidos.
- **React Native sin Expo.** Con `prebuild` Expo ya permite tocar lo nativo cuando haga falta.
- **Nativo (Kotlin y Swift).** Dos bases de código antes de saber si la app sirve.
- **Capacitor o PWA.** La web no garantiza GPS en segundo plano ni el magnetómetro.
- **SDK de Mapbox.** Token, facturación y telemetría. MapLibre es su bifurcación libre.
- **react-native-maps.** No controla el estilo por capa ni guarda zonas sin señal.
- **Leaflet en un WebView.** Lo que usaba el prototipo: lento con muchas líneas y sin sensores.
