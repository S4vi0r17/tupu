# 0013 — El recorrido se guarda en SQLite en el teléfono

Aceptada · 2026-09-08

## Contexto

Sin cuentas (0010), los recorridos viven en el teléfono. Una hora a un punto por segundo son unos
3600 puntos. Grabando con la pantalla apagada (0015), que Android mate la app a los 40 minutos es
lo esperable: si el recorrido se escribe al final, se pierde entero.

## Decisión

SQLite con `expo-sqlite`. Dos tablas: `rides`, la cabecera, y `ride_points`, insertados a medida
que llegan. Una caída pierde segundos, no el recorrido.

El historial es una consulta, y sincronizar algún día será leer filas y mandarlas.

## Se paga

- Una segunda base, con su esquema y sus migraciones.
- Escribir punto a punto gasta batería: van en lotes chicos.
- Con la sincronización habrá que decidir qué gana si un recorrido cambió en los dos lados.

## Descartado

- **AsyncStorage.** Obliga a tener los 3600 puntos en memoria y reescribirlos en cada guardado.
- **Un GeoJSON por recorrido.** Agregar puntos mientras se graba es incómodo, y listar el historial
  abre todos los archivos.
- **MMKV u `op-sqlite`.** Más rápidos, pero la velocidad no es el problema y suman código nativo.
