# SPEC-CAMERA — La cámara que te sigue

**Origen:** 0039.

---

## SPEC-CAMERA-01 — Un botón cicla tres modos

| Modo | Centro | Rumbo del mapa |
|---|---|---|
| `free` | Quieto | Solo con dos dedos |
| `follow` | El ciclista, a zoom 16 | Norte arriba |
| `follow-heading` | El ciclista, a zoom 16 | El de la brújula |

### Criterios

1. La app arranca en `follow`: el primer fix del GPS centra el mapa.
2. El botón pasa de `free` a `follow`, a `follow-heading` y vuelve a `free`.
3. El nombre accesible del botón dice lo que hará el toque, no el modo actual.

### Verificación

En la calle, 2026-09-10.

---

## SPEC-CAMERA-02 — La cámara se mueve solo si hace falta

### Criterios

1. En `follow` y `follow-heading`, una posición nueva mueve la cámara en 300 ms.
2. En `follow-heading`, un giro de 2,9° no la mueve; uno de 3° sí.
3. Cualquier gesto con el dedo pasa a `free`. Las animaciones propias no.
4. Llegar a una ruta pasa a `free` y encuadra el trazado (SPEC-ROUTE-04).

### Verificación

1 a 3: en la calle, 2026-09-10. 4: sin verificar en el teléfono.
