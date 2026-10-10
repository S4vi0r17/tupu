# 0039 — La cámara del mapa tiene tres modos, y un botón los cicla

**Estado:** Aceptada · 2026-09-10
**Reemplaza:** parcialmente a [0027](0027-brujula-muestra-hacia-donde-miras.md), que ataba la
rotación del mapa a la grabación del recorrido. El cono de visión y todo el resto de 0027 siguen
vigentes.

## Contexto

[0027](0027-brujula-muestra-hacia-donde-miras.md) decidió dos cosas: que el ciclista se dibuja con
un cono de visión —hecho—, y que **mientras se graba un recorrido el mapa rota**. La grabación es
el punto 6 del plan y todavía no existe: depende de SQLite en el teléfono
([0013](0013-recorrido-en-sqlite-local.md)) y de la ubicación en segundo plano
([0015](0015-grabacion-en-segundo-plano.md)).

Mientras tanto el mapa tiene un problema más básico y que sí se siente hoy:

```ts
if (!point || hasCentered.current) return
hasCentered.current = true
```

**Centra una vez, en el primer fix del GPS, y nunca más.** A las tres cuadras el punto azul se fue
de la pantalla y hay que arrastrar el mapa a mano, pedaleando.

Seguir al ciclista, entonces, no puede esperar a la grabación. Y en cuanto se escribe, el
disparador que 0027 eligió para la rotación deja de existir: no hay grabación de la que colgarla.
Hace falta otro.

## Decisión

La cámara no tiene un interruptor, tiene dos, y son independientes: **si el centro te sigue** y
**si el mapa gira con tu rumbo**. Dos interruptores dan cuatro combinaciones, pero una es absurda
—el mapa girando alrededor de un punto donde no estás— así que quedan tres:

| Modo | El centro | El rumbo del mapa | El momento |
|---|---|---|---|
| `free` | Donde lo dejaste | Solo si lo girás con dos dedos | Planificar, mirar dónde queda el destino |
| `follow` | Te sigue | Norte arriba | El semáforo, la avenida recta |
| `follow-heading` | Te sigue | Hacia donde mirás | Pedaleando, y sobre todo el cruce |

Un botón abajo a la derecha cicla los tres y muestra en cuál estás. **Cualquier gesto con el dedo
devuelve a `free`**: si arrastrás el mapa es porque querés mirar otra cosa, y que el siguiente fix
del GPS te lo arranque de un tirón es de lo más frustrante que hace una app de mapas.

La app arranca en `follow`, así el primer fix ya centra el mapa — el comportamiento de hoy, pero
sin el cerrojo.

El rumbo del mapa sale del **mismo valor suavizado de la brújula que mueve el cono**
([0025](0025-brujula-heading-fusionado.md)), no de una segunda fuente.

### El gesto propio no se distingue solo

MapLibre manda `userInteraction` en cada cambio de viewport, y la tentación es usarlo tal cual.
En Android está mal:

```kotlin
val isUserInteraction: Boolean
    get() = reason == USER_GESTURE || reason == DEVELOPER_ANIMATION
```

`DEVELOPER_ANIMATION` es **nuestra propia** animación de cámara. Usado tal cual, el modo se
apagaría solo en el primer movimiento que hiciera. Lo que separa los dos casos es el otro campo
del evento, `animated`: un dedo es `userInteraction && !animated`. En iOS no pasa, porque ahí se
enmascara lo programático — pero el MVP es Android ([0019](0019-mvp-solo-android.md)).

## Consecuencias

**A favor**

- **Arregla el problema real de hoy**, que no era la rotación sino que el mapa te abandona a las
  tres cuadras.
- **El semáforo tiene respuesta sin tocar 0025.** Parado, girás el manubrio para apoyar el pie y
  con `follow-heading` el mapa entero rota 30°. Es física de la brújula, no un error. `follow` es
  la salida, y cuesta un valor más en un estado que ya existía.
- **La rotación llega sin esperar a la grabación.** Y cuando la grabación se escriba no hay que
  inventar nada: elige un modo al empezar.
- **Un control menos.** La rosa del norte desaparece absorbida por el botón: dos botones que
  hablan los dos de orientación, uno arriba y otro abajo, confunden y ocupan pantalla que en una
  bici es cara.

**En contra**

- **Se pierde "enderezar sin centrarme".** Antes la rosa devolvía el norte dejándote donde
  estabas. Ahora volver al norte es entrar en `follow`, que además te centra. Es lo que querés
  casi siempre, pero no siempre.
- **Dos valores más puestos a ojo**: los 3° que tiene que girar el rumbo para mover el mapa, y los
  300 ms de cada animación. Se afinan en la calle, como el suavizado de 0025 — con el mismo riesgo
  de que haya que volver a tocarlos.
- **La batería.** 0027 ya avisaba de que rotar el mapa cuesta; ahora puede pasar fuera de la
  grabación, así que puede pasar durante más rato.
- **Las etiquetas del mapa rotan con él.** MapLibre puede mantenerlas horizontales y hay que
  configurarlo. No está hecho.
- **Arrancar en `follow` se apropia de la cámara al abrir.** Si abrís la app para mirar un barrio
  lejano, primero tenés que arrastrar.

## Alternativas descartadas

- **`trackUserLocation` de MapLibre**, que hace todo esto en una sola prop: `"default"` centra y
  `"heading"` centra y rota con la brújula, nativo y sin código nuestro. Se descartó porque toma
  el rumbo del **sensor crudo**, salteándose el filtro de [0025](0025-brujula-heading-fusionado.md)
  — y 0027 ya avisó de que con el mapa rotando el suavizado pasa de conveniente a crítico: un cono
  temblando molesta, un mapa entero temblando marea. Además arrancaría el motor de ubicación
  nativo de MapLibre, que es cambiar de dónde sale la posición en toda la app: eso merece su
  propia decisión, no entrar de refilón.
- **Dos modos, `free` ↔ `follow-heading`.** Es 0027 tal cual con el botón en lugar de la
  grabación, y la decisión nueva habría sido más chica. Se descartó por el semáforo: la única
  salida al bamboleo sería apagar el seguimiento entero, y al arrancar ya no estarías centrado.
- **Dos modos sin rotar nunca.** El cono ya dice hacia dónde mirás. Es la alternativa que
  [0027](0027-brujula-muestra-hacia-donde-miras.md) descartó con argumentos que siguen valiendo:
  en el cruce la línea se va a la izquierda en la pantalla y a tu derecha en la calle.
- **Congelar la rotación por debajo de cierta velocidad**, sin botón. Más automático. Se descartó
  porque es otro umbral que afinar a ciegas y necesita la velocidad del GPS, que la app todavía no
  lee. El modo lo resuelve explícito, y decide el ciclista.
