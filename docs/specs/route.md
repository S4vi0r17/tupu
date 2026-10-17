# SPEC-ROUTE — Ruta en bici entre dos puntos

**Origen:** 0028, 0029, 0040.

---

## SPEC-ROUTE-01 — El destino se fija con un toque largo o pegando coordenadas

### Criterios

1. Un toque largo marca el punto y ofrece «Ir aquí», «Salir de aquí» y «Cancelar».
2. «Ir aquí» lo fija como destino, «Salir de aquí» como inicio, «Cancelar» lo quita sin cambiar
   nada.
3. «Pegar coordenadas» acepta `-12.1211, -77.0301`, `-12.1211,-77.0301` y `-12.1211 -77.0301`.
4. Un par invertido, `-77.0301, -12.1211`, se voltea solo: en Perú los rangos no se cruzan.
5. Se rechazan con aviso, sin fijar nada: un punto fuera de Perú (`40.4, -3.7`), la coma decimal
   (`-12,1211 -77,0301`) y el texto suelto.

### Verificación

3 a 5: `parseCoordinates` con esos valores, 2026-10-16. 1 y 2: sin verificar en el teléfono.

---

## SPEC-ROUTE-02 — Sin inicio fijado, la ruta sale de la posición al elegir el destino

### Criterios

1. Con GPS y sin inicio, elegir el destino toma la posición de ese momento como inicio.
2. Moverse después no recalcula la ruta.
3. Elegir otro destino vuelve a tomar la posición.
4. Un inicio fijado a mano se conserva al cambiar el destino.
5. Sin permiso de ubicación ni inicio, el panel pide fijar el inicio en el mapa.

### Verificación

Sin verificar en el teléfono.

---

## SPEC-ROUTE-03 — El API distingue «no hay ruta» de «Valhalla no responde»

`POST /v1/routing/plan`, con el perfil ciclista de 0029.

| Caso | Respuesta |
|---|---|
| Hay ruta | 200: `distanceM`, `durationS`, `shape` (polilínea, precisión 6) |
| Valhalla da 154, 170, 171, 172, 442 o 443 | 422 `no_route` |
| Otro error de Valhalla, o no responde | 503 `upstream_unavailable` |
| La petición no cumple el contrato | 400 |

### Criterios

1. Miraflores (`-12.1211, -77.0301`) a San Isidro (`-12.0977, -77.0365`) da 200.
2. Un destino en el mar, `-14, -80`, da 422: Valhalla responde 171.
3. Iquitos, `-3.7, -73.25`, da 422: Valhalla responde 154, más de 500 km.
4. Con Valhalla apagado da 503.

### Verificación

1 a 3: `curl` contra el API local, 2026-10-16. 4: sin verificar.

---

## SPEC-ROUTE-04 — La app dice qué pasó con la ruta

### Criterios

1. Con 200: el trazado en violeta, `3,4 km · 13 min` y «Quitar ruta». La cámara pasa a `free` y
   encuadra el trazado.
2. Con 422: «No hay ruta en bici hasta ahí», sin reintentar.
3. Con 503 o sin señal: tres reintentos, y después el aviso con «Reintentar».
4. «Quitar ruta» borra el inicio, el destino y el trazado.

### Verificación

Sin verificar en el teléfono.
