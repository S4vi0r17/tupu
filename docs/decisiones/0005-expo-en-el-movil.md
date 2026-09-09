# 0005 — Expo + MapLibre GL Native en el móvil

**Estado:** Aceptada · 2026-09-08

## Contexto

La app necesita mapa, GPS continuo, y acceso al magnetómetro para saber hacia dónde apunta
físicamente el teléfono. Se consideraron Flutter y React Native sin Expo.

## Decisión

**Expo** (React Native gestionado) con **MapLibre GL Native** para el mapa.

### Por qué Expo y no Flutter

Flutter da mejor rendimiento nativo en mapa y sensores. El costo es que Dart rompe el monorepo:
los tipos compartidos con el API dejarían de ser un import y pasarían a ser generación de código
desde OpenAPI, con un paso más que mantener y que se puede olvidar. Con Expo, el móvil y el API
hablan el mismo lenguaje y comparten `packages/` directamente
([0002](0002-layout-del-repo.md), [0004](0004-hono-en-el-api.md)).

Para los sensores no hace falta bajar a nativo: la ubicación con rumbo real y el magnetómetro están
cubiertos por los módulos oficiales de Expo.

### Por qué MapLibre y no el mapa de Google

Tiles vectoriales sin cuota ni facturación, estilo del mapa controlado por nosotros —importa,
porque queremos resaltar las ciclovías sobre todo lo demás— y posibilidad de guardar zonas para uso
sin señal, que es el caso normal pedaleando.

## Consecuencias

**A favor**

- Un solo lenguaje en todo el repositorio.
- Los módulos de sensores y ubicación vienen resueltos y mantenidos.
- Builds y distribución sin cadena de herramientas nativa instalada en la máquina.

**En contra**

- **MapLibre no funciona en Expo Go**, la app de previsualización rápida: lleva código nativo, así
  que hace falta una build de desarrollo propia. Es un paso más al empezar y al añadir cualquier
  librería nativa.
- Rendimiento por debajo de lo nativo cuando se dibujan muchos trazados a la vez. La red de
  ciclovías de Lima entera puede ser mucho para pintar de golpe; habrá que filtrar por zona visible.
- Se depende del calendario de versiones de Expo para actualizar React Native.
- **El magnetómetro de un teléfono es ruidoso.** La flecha va a temblar si se pintan las lecturas
  crudas; hace falta suavizado, y eso es trabajo propio en cualquier tecnología.

## Alternativas descartadas

### La plataforma

- **Flutter** — mejor rendimiento en mapa y sensores, que es justo donde duele esta app. Se
  descartó porque Dart rompe el monorepo: los tipos compartidos dejan de ser un import y pasan a
  ser generación de código desde OpenAPI, con un paso más que mantener y que se puede olvidar
  ([0002](0002-layout-del-repo.md), [0004](0004-hono-en-el-api.md)).
- **React Native sin Expo (*bare*)** — las mismas librerías, con control total de la parte nativa.
  Se descartó porque hoy Expo ya no la impide: con *config plugins* y `prebuild` se puede tocar lo
  nativo cuando haga falta, sin renunciar a los módulos de sensores mantenidos ni a las builds sin
  Xcode instalado. Es una salida disponible, no un punto de partida.
- **Nativo puro (Kotlin + Swift)** — el mejor consumo de batería y el mejor acceso a sensores, que
  en una app que graba GPS durante una hora no es poca cosa. Se descartó por costo: dos bases de
  código, cero reutilización con el API, y el trabajo se multiplica antes de saber si la app le
  sirve a alguien.
- **Capacitor / Ionic, o una PWA** — se descartaron por una razón dura, no por preferencia: el
  seguimiento de ubicación **en segundo plano y con la pantalla apagada** es exactamente lo que la
  web no puede hacer de forma confiable en iOS, y el acceso al magnetómetro ahí es limitado y
  desigual. Las dos funcionalidades centrales de la app son las dos que no sobreviven al navegador.

### El mapa

- **SDK de Mapbox** — el mejor de todos: paquetes offline, estilos, rendimiento. Se descartó por
  el modelo de negocio: exige token y facturación pasado el nivel gratuito, y envía telemetría.
  MapLibre es precisamente su bifurcación libre desde antes del cambio de licencia, así que se
  queda con casi todo lo bueno.
- **`react-native-maps` (Google / Apple)** — con diferencia lo más fácil de arrancar. Se descartó
  porque no permite controlar el estilo del mapa a nivel de capa —y resaltar las ciclovías por
  encima de todo lo demás *es* el producto—, no da paquetes offline, y los términos de Google
  arrastran los mismos problemas que descartaron sus indicaciones de ruta
  ([0006](0006-valhalla-para-ruteo.md)).
- **Leaflet dentro de un WebView** — es lo que hace el prototipo del que sale este proyecto, y
  tiene la ventaja de que el código ya existe. Se descartó porque hereda todos sus límites:
  rendimiento pobre con muchos trazados, sin uso sin señal, y sin acceso a sensores ni a segundo
  plano desde dentro del WebView.
