# 0016 — Tiles del mapa: OpenFreeMap en el MVP, propios después

Aceptada · 2026-09-08

## Contexto

El prototipo usaba los tiles raster de openstreetmap.org. Su política de uso prohíbe apps, y al
venir dibujados no se pueden reestilizar, que es la razón de usar MapLibre (0005). Faltaba quién
sirve los tiles vectoriales.

## Decisión

OpenFreeMap en el MVP: gratis, sin registro ni clave. Tiles propios (Protomaps u otro) cuando
llegue el uso sin señal, que necesita control sobre los tiles.

Cambiar de proveedor es cambiar una URL.

## Se paga

- Es un servicio comunitario sin garantías: si se cae, se cae el mapa.
- Queda una migración pendiente, con disparador.

## Descartado

- **Protomaps propio desde el inicio.** Aplazado: es el candidato para cuando llegue el uso sin
  señal.
- **MapTiler o Stadia.** Registro, clave, y cobran por uso justo cuando la app crece.
- **Raster de openstreetmap.org.** Prohibido para apps, y no se puede reestilizar.
