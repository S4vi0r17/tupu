# 0026 — Las ciclovías se dibujan desde el tile, no desde el API

**Estado:** Aceptada · 2026-09-08

## Contexto

Resaltar las ciclovías sobre todo lo demás **es el producto** — es la razón por la que se eligió
MapLibre con tiles vectoriales ([0005](0005-expo-en-el-movil.md),
[0016](0016-tiles-openfreemap-en-el-mvp.md)). Faltaba de dónde salen las líneas que se pintan, y
hay dos fuentes posibles:

- **El tile que ya llega.** Los tiles vectoriales de OpenFreeMap traen la infraestructura ciclista
  como parte de su capa de transporte. Están descargados de todos modos.
- **El API, leyendo PostGIS.** El servidor devuelve las ciclovías de la zona visible y el mapa las
  pinta encima ([0011](0011-postgis-desde-el-inicio.md),
  [0012](0012-ingesta-de-osm-por-extracto.md)).

## Decisión

**Desde el tile, cambiando solo el estilo.** Se parte del estilo base de OpenFreeMap y se
sobreescriben las capas de infraestructura ciclista: color, grosor y orden de dibujo. El resto del
mapa se apaga.

No hay ninguna petición extra: los datos ya venían en el tile.

> **A verificar al empezar:** que el esquema de tiles exponga la infraestructura ciclista de forma
> distinguible. Si no lo hiciera, la alternativa descartada abajo pasa a ser la elegida — es un
> cambio de una capa del estilo, no de arquitectura.

## Consecuencias

**A favor**

- **Cero peticiones y velocidad nativa.** El mapa se mueve fluido porque no hay nada que pedir al
  arrastrar, que es exactamente donde una capa propia se sentiría lenta.
- Nada que recortar por zona visible ni que cachear en el móvil: trabajo que no hay que escribir.
- El estilo del mapa se puede trabajar desde el primer día, sin esperar a que el API sirva
  ciclovías.

**En contra**

- **Lo dibujado puede no coincidir con lo que la app sabe.** Las ciclovías del tile, las de PostGIS
  y las del grafo de Valhalla salen de OSM pero en momentos distintos: OpenFreeMap actualiza cuando
  quiere y nuestro extracto cuando se corre el comando ([0020](0020-actualizacion-de-datos-en-un-comando.md)).
  El síntoma será una ruta que pasa por una ciclovía que no está pintada, o al revés.
- **No se puede resaltar una ciclovía concreta** —la que la ruta usa, o la que el usuario toca—
  porque las del tile no tienen identidad que el API reconozca. Cuando eso haga falta, hará falta
  la capa propia.
- El estilo depende del esquema del proveedor. Si se cambia de proveedor
  ([0016](0016-tiles-openfreemap-en-el-mvp.md) prevé hacerlo), las capas de ciclovía hay que
  reescribirlas.
- **PostGIS queda infrautilizado en el MVP**, sirviendo solo la consulta de "ciclovías cerca de
  mí". No invalida [0011](0011-postgis-desde-el-inicio.md) —esa consulta sigue siendo la que lo
  justificó— pero conviene saberlo.

## Alternativas descartadas

- **Desde el API, leyendo PostGIS** — lo que se ve sería exactamente lo que la base y el ruteo
  conocen, y cada ciclovía tendría identidad, lo que habilita resaltar la que usa la ruta. Se
  descartó para el MVP por el costo: peticiones en cada movimiento del mapa, recorte por zona
  visible, caché en el móvil y una capa más que dibujar a mano. **Es la evolución natural** el día
  que haga falta resaltar tramos concretos.
- **Las dos fuentes a la vez** — el tile para el dibujo general y el API para el detalle al tocar.
  Se descartó porque tener dos fuentes que pueden discrepar en la misma pantalla es peor que
  cualquiera de las dos sola, y porque duplica el trabajo antes de saber si hace falta.
