# 0015 — Grabación en segundo plano con `expo-location`

Aceptada · 2026-09-08

## Contexto

Nadie pedalea mirando el teléfono. La app tiene que seguir tomando posiciones con la pantalla
apagada durante una hora o más. No hay solución que funcione siempre: Android mata procesos para
ahorrar batería, y fabricantes como Xiaomi, Oppo o Samsung lo hacen más que el Android puro.

## Decisión

`expo-location` con una tarea de fondo (`startLocationUpdatesAsync` y `expo-task-manager`), con
notificación persistente.

Los puntos se guardan al llegar (0013): si Android mata la tarea, se pierden segundos. No se evita
el corte; se hace que importe poco.

## Se paga

- En algunos teléfonos va a fallar sin arreglo. Hay que detectar el corte, avisar y quizá pedir
  que excluyan la app de la optimización de batería.
- Dos permisos: «mientras se usa» y «siempre». La pantalla que lo explica tiene que estar bien
  escrita o la gente lo niega.
- Batería: la frecuencia y la precisión se afinan en la calle.
- Probarlo exige salir en bici con teléfonos de distintas marcas.

## Descartado

- **`react-native-background-geolocation`.** La referencia para este problema, pero de pago en
  Android. Es la salida si `expo-location` falla en la calle.
- **Grabar solo con la pantalla encendida.** Obliga a pedalear con el teléfono en la mano.
