# 0027 — La brújula muestra hacia dónde mira el teléfono, no el destino

Aceptada · 2026-09-08 · Reemplaza el punto 4 de 0010 · La rotación del mapa, sustituida por 0039

## Contexto

0010 describía la brújula como una flecha hacia el destino. Eso sirve para orientarse sin mapa.
Pero el teléfono va en el portacelular, con el mapa delante: lo que falta es saber hacia dónde se
mira dentro de él.

## Decisión

- El punto de posición lleva un cono de visión que gira con el teléfono.
- Mientras se graba, el mapa rota para que arriba sea hacia donde se mira. Un botón vuelve al
  norte. (Sustituido por los tres modos de 0039.)

## Se paga

- El suavizado pasa a ser crítico: un cono temblando se ve mucho más que una flecha (0025).
- En el portacelular el teléfono va inclinado unos 45°: el rumbo tiene que compensarlo (0025).
- Rotar el mapa gasta batería y rota las etiquetas, salvo que se configure.
- La pantalla encendida en el manubrio gasta mucho: `expo-keep-awake` (0040).

## Descartado

- **Solo el cono, mapa siempre al norte.** En un cruce obliga a traducir mentalmente la dirección.
- **Mapa siempre rotando.** Incómodo para mirar el plano y planificar.
- **Flecha al destino.** Sirve con el teléfono guardado, que no es el caso.
