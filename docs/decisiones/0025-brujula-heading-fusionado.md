# 0025 — La brújula usa el rumbo fusionado del sistema, suavizado en el círculo

**Estado:** Aceptada · 2026-09-08

## Contexto

La brújula —un indicador de hacia dónde mira físicamente el teléfono, reflejado en el mapa
([0027](0027-brujula-muestra-hacia-donde-miras.md))— es una de las cuatro piezas del MVP
([0010](0010-alcance-del-mvp.md)) y lo que más diferencia a la app. Esta decisión es sobre **de
dónde sale ese rumbo y cómo se estabiliza**; 0027 es sobre qué se dibuja con él.

[0005](0005-expo-en-el-movil.md) apuntó el problema conocido: *"el magnetómetro de un teléfono es
ruidoso; la flecha va a temblar si se pintan las lecturas crudas"*. Pero planteó mal la solución
al hablar de leer el magnetómetro directamente. **El sistema operativo ya fusiona magnetómetro,
acelerómetro y giroscopio** y entrega un rumbo compensado por la inclinación del teléfono. Leer el
sensor crudo significa reimplementar a mano esa fusión.

## Decisión

Dos piezas:

1. **`Location.watchHeadingAsync` de `expo-location`** como fuente. Entrega el rumbo ya fusionado,
   más un valor de precisión que permite avisar al usuario cuándo hace falta calibrar moviendo el
   teléfono en ocho.
2. **Un filtro paso bajo exponencial encima**, aplicado **en el círculo**.

### Por qué "en el círculo" no es un detalle

Los ángulos no se pueden promediar como números. Entre 359° y 1° la diferencia real es de 2°, pero
el promedio aritmético da 180°: **la flecha pega la vuelta entera** cada vez que el usuario cruza
el norte. El suavizado tiene que hacerse descomponiendo en seno y coseno, promediando cada
componente y recomponiendo el ángulo con `atan2`.

Son unas quince líneas en `packages/geo` ([0002](0002-layout-del-repo.md)) y un solo parámetro que
ajustar: cuánto pesa la lectura nueva frente al valor acumulado. Se afina probando en la calle,
no en el escritorio.

## Consecuencias

**A favor**

- No se reimplementa una fusión de sensores que el sistema ya hace mejor, y que además compensa la
  inclinación — sin eso la flecha miente en cuanto se inclina el teléfono, que es la postura normal
  en el manubrio.
- El valor de precisión que acompaña al rumbo permite algo que el sensor crudo no da: **saber
  cuándo no confiar** y pedirle al usuario que calibre.
- El filtro vive en `packages/geo`, así que es una función pura, y el día que haya tests
  ([0024](0024-sin-tests-durante-el-mvp.md)) es de lo primero y más fácil de cubrir.

**En contra**

- **El suavizado es un compromiso sin respuesta correcta**: mucho filtro y la flecha va con
  retraso, poco filtro y tiembla. El parámetro se ajusta a ojo y probablemente haya que volver a
  tocarlo.
- **La calibración depende del usuario.** Si no mueve el teléfono en ocho cuando se le pide, la
  brújula seguirá mal y la app no puede hacer nada.
- El rumbo magnético se desvía cerca de metal — el manubrio, un soporte imantado, un poste. Es
  física, no un error, pero el usuario lo va a leer como que la app falla.
- Un teléfono con el magnetómetro roto o ausente no tiene brújula. Hay que detectarlo y degradar
  la pantalla en vez de mostrar una flecha inventada.

## Alternativas descartadas

- **Magnetómetro crudo con `expo-sensors`** — control total sobre el cálculo. Se descartó porque
  compensar la inclinación con el acelerómetro es matemática ya resuelta por el sistema, y hacerla
  a medias produce una flecha que miente justo en la postura en que se va a usar.
- **El rumbo del movimiento según el GPS** — estable, sin ruido y sin filtro que ajustar. Se
  descartó porque responde a hacia dónde te *desplazas*, no a hacia dónde *apunta* el teléfono:
  parado no apunta a nada y girar el teléfono no cambia nada. Sería otra funcionalidad, no una
  versión más simple de ésta.
