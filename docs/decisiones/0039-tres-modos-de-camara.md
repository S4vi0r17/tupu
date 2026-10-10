# 0039 — La cámara del mapa tiene tres modos, y un botón los cicla

Aceptada · 2026-09-10 · Reemplaza en parte a 0027: la rotación ya no depende de la grabación

## Contexto

0027 rotaba el mapa mientras se graba, pero la grabación no existe todavía. Y había un problema más
básico: el mapa centraba una vez, en el primer fix, y nunca más. A las tres cuadras el punto azul
salía de la pantalla.

## Decisión

Dos interruptores independientes, si el centro sigue al ciclista y si el mapa gira con su rumbo,
dan tres modos útiles:

| Modo | Centro | Rumbo del mapa | Para |
|---|---|---|---|
| `free` | Quieto | Solo con dos dedos | Mirar y planificar |
| `follow` | El ciclista | Norte arriba | El semáforo, la avenida recta |
| `follow-heading` | El ciclista | Hacia donde mira | Pedalear, los cruces |

Un botón los cicla. Cualquier gesto con el dedo vuelve a `free`. La app arranca en `follow`.

El rumbo del mapa es el mismo valor suavizado del cono (0025).

En Android, `userInteraction` es `true` también en nuestras animaciones (`DEVELOPER_ANIMATION`).
Un dedo es `userInteraction && !animated`.

## Se paga

- Volver al norte es entrar en `follow`, que además centra.
- Dos valores a ojo: 3° de giro mínimo y 300 ms por animación. Probados en la calle el 2026-09-10
  y dados por buenos.
- La rotación puede pasar fuera de la grabación: más batería.
- Las etiquetas giran con el mapa hasta que se configure lo contrario.
- Arrancar en `follow` toma la cámara al abrir.

## Descartado

- **`trackUserLocation` de MapLibre.** Hace todo esto en una prop, pero usa el sensor crudo y no
  el filtro de 0025: un mapa entero temblando marea.
- **Dos modos, `free` y `follow-heading`.** Parado en un semáforo, el mapa gira con cada movimiento
  del manubrio y la única salida sería dejar de seguir.
- **Nunca rotar.** En un cruce, la línea a la izquierda de la pantalla queda a la derecha en la
  calle.
- **Congelar la rotación por debajo de cierta velocidad.** Otro umbral a ciegas.
