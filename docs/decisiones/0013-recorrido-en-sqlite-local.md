# 0013 — El recorrido se guarda en SQLite en el teléfono

**Estado:** Aceptada · 2026-09-08

## Contexto

[0010](0010-alcance-del-mvp.md) dejó las cuentas fuera del MVP, así que los recorridos viven en el
teléfono. Un recorrido de una hora tomando una posición por segundo son unos **3.600 puntos GPS**,
cada uno con latitud, longitud, momento y precisión.

La pregunta real no es dónde meterlos, sino **qué pasa si la app se cae a los 40 minutos**. Si el
recorrido se escribe entero al terminar, una caída se lleva la hora completa — y grabando en
segundo plano con la pantalla apagada ([0015](0015-grabacion-en-segundo-plano.md)), que el sistema
mate el proceso no es un caso raro: es lo esperable.

## Decisión

**SQLite en el dispositivo, con `expo-sqlite`.** Dos tablas: `rides` con la cabecera del recorrido
y `ride_points` con los puntos, insertados **a medida que llegan**.

Una caída pierde los últimos segundos, no el recorrido.

Además deja el camino servido para cuando lleguen las cuentas: sincronizar es leer filas y
mandarlas, y la forma de esas filas puede definirse desde ya en `packages/contracts`
([0002](0002-layout-del-repo.md)) aunque en el MVP solo la use el móvil.

## Consecuencias

**A favor**

- **Resistente a caídas**, que es el requisito que decidió.
- El historial —"mis recorridos por fecha, con sus kilómetros"— es una consulta, no leer y parsear
  todo lo guardado.
- Miles de filas no son nada para SQLite. El tamaño deja de ser una preocupación.
- `expo-sqlite` es pieza oficial de Expo: sin configuración nativa propia
  ([0005](0005-expo-en-el-movil.md)).

**En contra**

- **Hay SQL en el cliente**, y un esquema local que versionar y migrar cuando cambie. Es una
  segunda base de datos en el proyecto, con sus propias migraciones, separada de la del servidor.
- Insertar punto a punto escribe en disco todo el rato; hay que agrupar en lotes pequeños para no
  castigar la batería.
- Cuando llegue la sincronización habrá que decidir qué manda si un recorrido cambió en los dos
  lados. Se aplaza, pero llegará.

## Alternativas descartadas

- **AsyncStorage** (clave-valor) — lo más simple de escribir. Se descartó por el requisito
  central: obliga a tener los 3.600 puntos en memoria y reescribir el bloque entero en cada
  guardado, así que o guardas seguido y castigas el disco, o guardas poco y pierdes el recorrido.
  Tampoco está pensado para megabytes.
- **Un archivo GeoJSON por recorrido** — simple, portable, y ya en el formato que querrá el
  servidor. Se descartó porque añadir puntos a un archivo mientras se graba es incómodo, y porque
  listar el historial obliga a abrir todos los archivos para leer sus cabeceras.
- **MMKV u `op-sqlite`** — más rápidos que las piezas oficiales. Se descartó por desproporción:
  el cuello de botella aquí nunca va a ser la velocidad de escritura, y ambos añaden configuración
  nativa.
