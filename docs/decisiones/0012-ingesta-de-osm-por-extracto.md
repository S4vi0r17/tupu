# 0012 — La red de ciclovías se ingiere de un extracto de OSM, a mano

**Estado:** Aceptada · 2026-09-08

## Contexto

**OpenStreetMap es un mapa mundial libre que edita cualquiera** — Wikipedia, pero de mapas. Las
ciclovías de Lima están ahí porque voluntarios las dibujaron, y no hay otra fuente gratuita y
completa. La pregunta era cómo llegan a nuestra base.

Hay dos formas de sacar datos de OSM:

- **Overpass API** — servidores públicos a los que se les pregunta en vivo. Es lo que hace el
  prototipo del que sale este proyecto, y su código lo delata: pide los datos a través de dos
  *proxies* CORS, reintenta contra dos servidores distintos, y su mensaje de error dice
  literalmente *"los servidores públicos de Overpass a veces están saturados"*.
- **Un extracto** — Geofabrik publica un archivo `.osm.pbf` con todo OSM de Perú, actualizado a
  diario. Se descarga, se filtra y se carga en la base propia.

Y hay un ahorro que decide: **Valhalla ya necesita ese mismo archivo de Perú** para construir sus
tiles de ruteo ([0006](0006-valhalla-para-ruteo.md)). Un solo archivo alimenta las dos cosas, y
así hay una sola cosa que envejece en vez de dos que se desincronizan.

## Decisión

Un **script que se corre a mano**, `bun run ingest`, que hace tres pasos sobre el extracto de Perú:

1. **Descargar** el `.pbf` de Geofabrik — el mismo que consume Valhalla.
2. **Filtrar** la infraestructura ciclista con `osmium tags-filter`.
3. **Cargar** en PostGIS con `ogr2ogr`, dentro de una transacción, reemplazando la tabla entera.

**El cron queda aplazado, no descartado.** Automatizarlo es literalmente el mismo script corriendo
solo: no hay nada que rehacer, así que no hay razón para pagar hoy la complejidad de que corra
desatendido. Se añade cuando correrlo a mano moleste.

### La carga se hace de golpe y reemplazando

Aunque se corra a mano, el reemplazo va en una transacción: se carga en una tabla nueva y se
renombra al final. Si algo falla a la mitad, la app sigue con los datos viejos en vez de quedarse
sin ciclovías. Esto se escribe así desde el principio porque es el mismo trabajo, y es
precisamente lo que hará falta el día que corra sola.

### Lo que se filtra no es obvio

En OSM la infraestructura ciclista no está en una sola etiqueta. Hay al menos tres formas de
mapearla:

- `highway=cycleway` — una vía propia solo para bicis.
- `cycleway=track` / `cycleway=lane` sobre una calle normal — carril dentro de la calzada.
- `bicycle=designated` — vía compartida señalizada para bicis.

Quedarse solo con la primera pierde buena parte de la red real de Lima. El filtro exacto es
trabajo de afinamiento, y el prototipo ya avisa de esto en su propio pie de página: *"solo muestra
tramos etiquetados — zonas mal mapeadas pueden aparecer vacías aunque tengan ciclovía real"*.

## Consecuencias

**A favor**

- **La app deja de depender de servidores de terceros** para funcionar. Era uno de los tres
  límites del prototipo que este proyecto viene a resolver.
- Los datos quedan en PostGIS ([0011](0011-postgis-desde-el-inicio.md)) con índice espacial, así
  que las consultas son nuestras y rápidas.
- Un solo archivo de origen para ciclovías y para ruteo.

**En contra**

- **Los datos envejecen hasta que alguien corra el script.** Una ciclovía nueva no aparece sola.
  Con Lima y su ritmo de obra esto puede ser meses, y hay que asumirlo conscientemente.
- **Es un paso manual que se olvida**, que es justo lo que el cron resolverá.
- El extracto y el filtrado necesitan disco y herramientas (`osmium`, `ogr2ogr`) en la máquina que
  lo corra. En el VPS son un contenedor más; en la máquina de desarrollo, dos instalaciones.

## Alternativas descartadas

- **Overpass API en vivo**, como el prototipo — cero ingesta y siempre fresco, y el código ya
  existe. Se descartó por los dos límites que el README nombra como motivo del proyecto: depende
  de servidores públicos que se saturan, y no sirve sin señal. Además impide tener índices propios
  y hace imposible cualquier consulta espacial nuestra.
- **Overpass una vez, a mano, y volver a correrlo cuando alguien note que falta algo** — lo más
  rápido hoy. Se descartó porque produce exactamente el mismo script que la opción elegida pero
  contra una fuente peor, así que no ahorra trabajo: solo lo hace con datos menos fiables.
- **`osm2pgsql` importando el extracto completo** en vez de solo lo ciclista. Da flexibilidad para
  consultas futuras que hoy no existen, a cambio de una base mucho más pesada y un import mucho
  más lento. Si algún día hace falta, el cambio es de una herramienta, no de arquitectura.
- **Automatizarlo con cron desde el inicio** — se aplazó, no se descartó. El script es el mismo;
  correrlo solo solo añade el riesgo de que una importación defectuosa entre sin que nadie mire.
