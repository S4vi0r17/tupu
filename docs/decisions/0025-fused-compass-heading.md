# 0025 — La brújula usa el rumbo fusionado del sistema, suavizado en el círculo

Aceptada · 2026-09-08

## Contexto

El magnetómetro es ruidoso (0005). Pero el sistema ya fusiona magnetómetro, acelerómetro y
giroscopio, y entrega un rumbo compensado por la inclinación. Leer el sensor crudo sería
reimplementar eso.

## Decisión

- La fuente es `Location.watchHeadingAsync`: rumbo fusionado y un nivel de precisión para pedir
  que se calibre.
- Encima, un filtro paso bajo en el círculo: seno y coseno por separado, y `atan2` para volver al
  ángulo. Entre 359° y 1° la media en grados da 180°, y la flecha daría la vuelta entera.

Vive en `packages/geo`, con un solo parámetro a afinar en la calle.

## Se paga

- Más filtro va con retraso; menos tiembla. No hay valor correcto.
- Si el usuario no calibra cuando se le pide, la brújula sigue mal.
- Cerca de metal el rumbo se desvía, y se va a leer como un error de la app.
- Un teléfono sin magnetómetro no tiene brújula: hay que detectarlo.

## Descartado

- **Magnetómetro crudo con `expo-sensors`.** Compensar la inclinación a mano, a medias, miente
  justo en el portacelular.
- **Rumbo del GPS.** Dice hacia dónde se mueve el ciclista, no hacia dónde apunta el teléfono.
