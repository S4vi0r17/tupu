# SPEC-COMPASS — Hacia dónde mira el teléfono

**Origen:** 0025, 0027.

---

## SPEC-COMPASS-01 — El cono apunta hacia donde mira el teléfono, sin temblar

### Criterios

1. Usa `trueHeading`; mientras vale -1, antes del primer fix, usa `magHeading`.
2. Cada 50 ms avanza 0,2 de lo que falta, aunque Android no mande lecturas nuevas.
3. De 359° a 1° gira 2° por el norte, no 358° por el sur.
4. El cono gira con el mapa en `follow-heading`: está alineado al mapa, no a la pantalla.

### Verificación

En la calle, con el teléfono en el portacelular, 2026-09-10.

---

## SPEC-COMPASS-02 — Cuando la brújula no sirve, la app lo dice

| Situación | Cómo se detecta | Aviso |
|---|---|---|
| Sin permiso de ubicación | El diálogo lo niega | «Sin permiso de ubicación no se puede mostrar dónde estás.» |
| Sin magnetómetro | Ninguna lectura en 6 s | «Este teléfono no tiene brújula: no se puede mostrar hacia dónde miras.» |
| Descalibrada | Precisión de Android menor a 2, desde la lectura 12 | «Brújula perdida. Mueve el teléfono dibujando un ocho en el aire.» |

### Criterios

1. Sin magnetómetro no se dibuja el cono.
2. Las once primeras lecturas no piden calibrar, aunque Android diga 0.
3. Con precisión 2 o más no se pide calibrar.

### Verificación

1: sin verificar, falta un teléfono sin magnetómetro. 2 y 3: en la calle, 2026-09-10.
