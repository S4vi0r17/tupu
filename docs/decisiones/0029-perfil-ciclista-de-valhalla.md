# 0029 — Perfil ciclista: prioriza ciclovía y evita cuestas

**Estado:** Aceptada · 2026-09-08 · **valores de partida, se afinan pedaleando**

## Contexto

[0006](0006-valhalla-para-ruteo.md) eligió Valhalla precisamente porque el criterio de ruteo viaja
**en cada petición** y no horneado en el grafo. Pero nunca se dijo con qué valores.

Eso importa más de lo que parece: **es literalmente donde la app se diferencia.** Con los valores
por defecto, Valhalla devuelve una ruta ciclista genérica, parecida a la de cualquier otra app.

### Cómo decide Valhalla cuál es "la mejor"

No es la más corta ni la más rápida. Le pone un **costo** a cada tramo de calle y busca el camino
de costo total mínimo. El costo parte del tiempo estimado y después se ajusta:

- Una avenida con tráfico se penaliza fuerte para bici
- Una ciclovía se descuenta
- El mal pavimento se penaliza según el tipo de bici
- La subida se penaliza según cuánto importen las cuestas
- Cada giro y cada cruce cuestan un poco

Así que "mejor" significa **más barato**, donde barato mezcla rápido, cómodo y seguro según los
pesos que uno ponga.

## Decisión

```jsonc
{
  "costing": "bicycle",
  "costing_options": {
    "bicycle": {
      "bicycle_type": "Hybrid",      // bici urbana, no de ruta ni de montaña
      "cycling_speed": 18,           // km/h en llano
      "use_roads": 0.2,              // por debajo del defecto: prefiere ciclovía aunque alargue
      "use_hills": 0.2,              // por debajo del defecto: bordea las subidas fuertes
      "avoid_bad_surfaces": 0.5      // por encima del defecto: esquiva el pavimento malo
    }
  }
}
```

**`use_roads` y `use_hills` bajos son la decisión**, no un ajuste conservador: son la premisa de
la app escrita en números. Rutas más largas y más tranquilas. En la Costa Verde, `use_hills` es lo
que decide si te manda por el acantilado o lo bordea — el caso que
[0006](0006-valhalla-para-ruteo.md) ya nombraba.

Los valores viven **en un solo sitio**, en `features/routing`
([0008](0008-apps-api-por-funcionalidad.md)), para que afinarlos sea tocar un archivo.

## Estos valores están mal, y se sabe

No hay forma de acertarlos desde el escritorio. Están puestos por criterio, no por medición, y
**la expectativa es corregirlos varias veces** saliendo a pedalear y viendo si la ruta tiene
sentido. Es exactamente el objetivo que [0010](0010-alcance-del-mvp.md) le puso al MVP: *validar
que Valhalla dé rutas ciclistas decentes en Lima.*

Cuando se corrijan, este documento se actualiza con los valores nuevos y **por qué** cambiaron —
esa bitácora vale más que los números en sí.

## Consecuencias

**A favor**

- La app da rutas que se sienten distintas a las de Google Maps, que es la razón de existir del
  proyecto.
- Cambiar el perfil es cambiar un archivo y desplegar: no hay que reconstruir el grafo
  ([0020](0020-actualizacion-de-datos-en-un-comando.md)), que es justo lo que
  [0006](0006-valhalla-para-ruteo.md) compró al descartar OSRM.
- Con estos valores, el mapa de ciclovías resaltadas y la ruta propuesta van a **coincidir
  visualmente**, lo que hace que la app se explique sola.

**En contra**

- **`use_roads` muy bajo puede dar rodeos absurdos.** Si la ciclovía más cercana está a diez
  cuadras, el motor puede preferir ir hasta ella antes que cuatro cuadras por una calle tranquila.
  Es el fallo más probable de este perfil y hay que vigilarlo.
- **La red de ciclovías de Lima está incompleta en OSM.** Un perfil que las prioriza tanto amplifica
  los huecos del mapeo: donde falta una ciclovía real, la ruta se irá lejos a buscar otra
  ([0012](0012-ingesta-de-osm-por-extracto.md) ya avisa de esto).
- **La elevación tiene que estar activada** al construir el grafo, o `use_hills` no hace nada.
  Eso es más descarga y más tiempo en `osm:update`.
- `cycling_speed: 18` es un promedio inventado: los tiempos estimados van a estar sesgados hasta
  que se comparen con recorridos reales — que es, no por casualidad, lo que el historial va a
  permitir medir.

## Alternativas descartadas

- **Los valores por defecto de Valhalla** (equilibrados). Menos riesgo de ruta rarísima, pero
  también menos diferencia respecto de cualquier otra app. Se descartó porque tercerizar el
  criterio es tercerizar el producto — el mismo argumento con el que
  [0006](0006-valhalla-para-ruteo.md) descartó los servicios en la nube.
- **Un perfil rápido**, con `use_roads` alto — bueno para quien conoce la ciudad y pedalea fuerte.
  Se descartó porque contradice el motivo por el que existe tupu.
- **Exponer los mandos al usuario** desde el MVP, para que cada uno ajuste su perfil. Es la
  evolución natural y Valhalla lo permite sin ningún trabajo extra. Se aplaza porque primero hay
  que saber qué valores son buenos por defecto: dar mandos sin un buen punto de partida traslada
  el problema al usuario.
