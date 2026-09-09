# 0016 — Tiles vectoriales: OpenFreeMap en el MVP, self-host después

**Estado:** Aceptada · 2026-09-08

## Contexto

El mapa se entrega en cuadraditos —*tiles*— y solo se descargan los que caben en pantalla. Los hay
de dos clases: **raster**, que llegan ya dibujados como una foto, y **vectoriales**, que llegan
como datos y los dibuja la app.

El prototipo usa raster del servidor de openstreetmap.org, y eso no se puede heredar por dos
razones independientes:

- **Su política de uso prohíbe aplicaciones.** Esos servidores se pagan con donaciones para
  openstreetmap.org y para pruebas sueltas.
- **Al venir dibujados, no se pueden reestilizar.** Y resaltar las ciclovías por encima de todo lo
  demás *es* el producto — es la razón por la que se eligió MapLibre
  ([0005](0005-expo-en-el-movil.md)).

Quedaba entonces quién sirve los tiles vectoriales.

## Decisión

**Por etapas, y a propósito.**

1. **En el MVP: OpenFreeMap.** Servicio comunitario gratuito, sin registro ni clave. Se pega la URL
   del estilo y hay mapa el mismo día.
2. **Antes de publicar, o cuando llegue el uso sin señal: self-host.** Protomaps u otra
   alternativa que se evalúe entonces.

Lo que hace razonable posponerlo es que **cambiar de proveedor es cambiar una URL** en el archivo
de estilo del mapa. Es de las decisiones más baratas de revertir del proyecto, así que pagar hoy
por montar un servidor de tiles compra muy poco.

El disparador de la etapa 2 está claro y conviene dejarlo escrito: **el uso sin señal**, que quedó
fuera del MVP ([0010](0010-alcance-del-mvp.md)). Guardar zonas del mapa en el teléfono necesita
control sobre los tiles, y ahí OpenFreeMap deja de alcanzar.

## Consecuencias

**A favor**

- Cero infraestructura mientras se construye lo que de verdad hay que validar: que Valhalla dé
  rutas ciclistas decentes en Lima.
- Sin clave, sin registro, sin cuota que vigilar durante el desarrollo.
- Tiles vectoriales desde el primer día, así que el estilo con las ciclovías resaltadas se trabaja
  desde ya y no hay que rehacerlo al cambiar de proveedor.

**En contra**

- **Es un servicio comunitario sin garantías.** Si se cae, el mapa de la app se cae. Aceptable
  mientras solo lo usemos nosotros; inaceptable el día que haya usuarios, y por eso la etapa 2
  tiene disparador y no queda al azar.
- **Es una migración pendiente que hay que recordar**, no un final. Queda apuntada como pendiente
  con su condición de disparo.
- El estilo del mapa hay que escribirlo igual: OpenFreeMap da tiles, no el diseño con las
  ciclovías resaltadas. Eso es trabajo propio en cualquiera de las tres opciones.

## Alternativas descartadas

- **Self-host con Protomaps desde el inicio** — un solo archivo `.pmtiles` de Perú en el VPS, sin
  depender de nadie, y ese mismo archivo sirve luego para el uso sin señal. No se descartó: se
  **aplazó**, y es la candidata para la etapa 2. Montarlo ahora sería un servicio más antes de
  haber visto la primera ruta en pantalla.
- **MapTiler o Stadia** — lo más pulido, con estilos hechos y paquetes offline soportados por el
  SDK. Se descartó para el MVP porque requiere registro y clave, y a futuro porque factura por uso
  justo cuando la app crezca, que es lo contrario de lo que busca el resto del stack.
- **Seguir con raster de openstreetmap.org**, como el prototipo — descartado sin más: su política
  de uso lo prohíbe y anula la razón de haber elegido MapLibre.
