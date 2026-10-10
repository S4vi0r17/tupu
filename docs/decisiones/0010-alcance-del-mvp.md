# 0010 — Alcance del MVP

Aceptada · 2026-09-08 · Ampliada por 0040 (voz, velocímetro, pantalla encendida) · La brújula,
redefinida por 0027

## Contexto

La planeación arrancó con cuentas e historial desde el primer día. Eso obligaba a construir
registro, login y sincronización antes de ver una ruta. Lo que hay que validar primero es otra
cosa: si Valhalla da rutas ciclistas decentes en Lima.

## Decisión

Cuatro piezas:

1. Mapa con las ciclovías de Lima.
2. Ruta en bici entre dos puntos, con distancia y tiempo.
3. Grabación del recorrido, guardada en el teléfono.
4. Brújula: hacia dónde mira el teléfono (0027).

Fuera, para después: cuentas y sincronización, rutas alternativas, uso sin señal, isócronas.

Las dos primeras validan la infraestructura. Las dos últimas son las más difíciles del lado móvil
(GPS con pantalla apagada, magnetómetro ruidoso), y dejarlas para después sería dejar el riesgo
para después.

## Se paga

- Los recorridos se pierden al desinstalar la app o cambiar de teléfono, hasta que haya cuentas.
- El recorrido se define en el teléfono y después en el servidor: la forma tiene que pensarse para
  subirla algún día (0013).
