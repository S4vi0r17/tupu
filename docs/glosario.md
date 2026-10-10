# Glosario

Qué significa cada palabra rara que aparece en las decisiones, explicada con lo que hace **en
tupu**, no en abstracto.

> **Aviso sobre la palabra "tiles":** significa **dos cosas distintas y sin relación** en este
> proyecto. Ver *Tiles del mapa* y *Tiles de ruteo* más abajo. Es una colisión de nombres
> desafortunada pero es la que usa todo el mundo, así que en `docs/` siempre se dice cuál de las
> dos.

## Los datos

**OpenStreetMap (OSM)** — un mapa mundial libre que edita cualquiera; Wikipedia, pero de mapas. Las
ciclovías de Lima están ahí porque voluntarios las dibujaron. Es la fuente de todo lo geográfico
del proyecto.

**Overpass API** — servidores públicos donde se le pueden hacer preguntas a OSM en vivo
("dame las ciclovías de Lima"). Gratis y siempre fresco, pero comunitario y saturado. Es lo que
usa el prototipo y lo que [0012](decisiones/0012-ingesta-de-osm-por-extracto.md) descartó.

**Extracto / archivo `.pbf`** — un volcado de todo OSM de una región, en un archivo. Geofabrik
publica el de Perú y lo actualiza a diario. Se descarga una vez y sirve para todo, sin depender de
servidores ajenos.

**Ingesta** — el proceso de bajar el extracto, filtrar lo que interesa (las ciclovías) y cargarlo
en nuestra base.

## El mapa que se ve

**Tiles del mapa** — el mapa se corta en cuadraditos y el teléfono baja solo los que caben en
pantalla. Cada cuadrado se pide por zoom, columna y fila: `/{z}/{x}/{y}`. A zoom de calle el mundo
son cientos de millones de cuadrados; tu pantalla usa unos seis.

- **Raster** — el cuadrado llega como una **foto** ya dibujada. No se pueden cambiar los colores.
- **Vectorial** — el cuadrado llega como **datos** ("aquí una línea, es la Av. Arequipa") y la app
  los dibuja. Permite decir "ciclovías verdes y gruesas, todo lo demás gris", que es el producto.

**Servidor de tiles** — quien guarda esos cuadraditos y los entrega. En el MVP es OpenFreeMap
([0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md)).

**MapLibre** — la librería que dibuja el mapa en la app a partir de tiles vectoriales.

## El ruteo

**Motor de ruteo** — el programa que responde *"¿cuál es la mejor ruta en bici de aquí a allá y
cuánto tardo?"*. En tupu es Valhalla ([0006](decisiones/0006-valhalla-para-ruteo.md)).

**Grafo de ruteo** — la red de calles convertida en algo navegable: qué intersección conecta con
cuál, en qué sentido, cuánto se tarda en bici, qué pendiente tiene. El extracto de OSM **no** trae
esto: trae líneas con etiquetas. Construir el grafo es el trabajo pesado.

**Tiles de ruteo (los de Valhalla)** — ese grafo, cortado en cuadrados geográficos para que el
motor cargue en memoria solo la zona que necesita. **No son imágenes y no tienen nada que ver con
los tiles del mapa.** Para Perú ocupan unos 425 MB, más que el extracto del que salen: el `.pbf`
viene comprimido y el grafo no, porque está hecho para responder rápido y no para pesar poco.

**Costeo (*costing*)** — las reglas de preferencia: cuánto premia una ciclovía, cuánto penaliza una
subida, si evita el mal pavimento. En Valhalla viajan **en cada petición**, así que se pueden
cambiar sin reconstruir nada — ésa es la razón por la que se eligió.

**Isócrona** — la mancha en el mapa de "hasta dónde llego en 20 minutos".

**Map matching** — pegar los puntos GPS a las calles reales, para que el trazado guardado siga las
vías en vez de zigzaguear con el error del GPS.

## La base de datos

**PostgreSQL** — la base de datos. Entiende de números, texto y fechas.

**PostGIS** — **no es una base de datos ni una tabla: es un plugin** que se instala dentro de
PostgreSQL y le enseña geografía. Añade tipos de columna (punto, línea) y funciones para
operarlos. Sin él, una ciclovía guardada es solo texto y no se puede preguntar qué hay cerca
([0011](decisiones/0011-postgis-desde-el-inicio.md), [modelo de datos](modelo-datos.md)).

**Funciones `ST_`** — las funciones espaciales de PostGIS. `ST_DWithin(a, b, 300)` responde "¿están
a menos de 300 m?" usando índice; `ST_Length` da los metros de un trazado.

**Índice espacial (GiST)** — la base mantiene el mapa dividido en cajas para mirar solo las
relevantes. Es lo que hace que buscar ciclovías cercanas tarde milisegundos y no segundos.

**ORM** — la capa entre el código y la base, para no escribir SQL a mano en todo. Aquí es Drizzle
([0007](decisiones/0007-drizzle-para-acceso-a-datos.md)).

**Migración** — un cambio de estructura de la base (crear una tabla, añadir una columna) guardado
como un archivo, para poder aplicarlo en orden en cualquier máquina.

## El despliegue

**VPS** — un servidor alquilado, una máquina Linux en internet.

**Dokploy** — el panel que se instala en ese VPS para desplegar contenedores sin hacerlo a mano
([0009](decisiones/0009-despliegue-en-dokploy.md)).

**Docker / contenedor** — cada pieza (API, base, Valhalla) empaquetada con todo lo que necesita,
para que corra igual en tu máquina y en el VPS.

**Staging** — una copia completa del sistema para ensayar antes de tocar producción. Este proyecto
no tiene ([0018](decisiones/0018-sin-entorno-de-pruebas.md)).

## El móvil

**Expo** — el conjunto de herramientas para hacer la app con React Native sin pelear con Xcode ni
Android Studio.

**EAS** — el servicio de compilación en la nube de Expo. Necesario para iOS desde Linux; el MVP no
lo usa ([0019](decisiones/0019-mvp-solo-android.md)).

**APK** — el archivo instalable de una app Android. Se puede pasar por WhatsApp y ya.

**Magnetómetro** — el sensor que detecta el campo magnético y permite saber hacia dónde apunta el
teléfono. Es la base de la brújula, y sus lecturas son ruidosas: hay que suavizarlas o la flecha
tiembla.

**Tarea en segundo plano** — código que sigue corriendo con la app minimizada y la pantalla
apagada. Es como se graba el recorrido ([0015](decisiones/0015-grabacion-en-segundo-plano.md)).
