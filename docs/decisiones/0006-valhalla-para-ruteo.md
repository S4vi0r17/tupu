# 0006 — Valhalla self-hosted para calcular rutas

**Estado:** Aceptada · 2026-09-08

## Contexto

El corazón de la app es responder *"¿cuál es la mejor ruta en bici de aquí a allá, cuánto tardo y
qué alternativas tengo?"*. Eso no se improvisa: hace falta un motor de ruteo real sobre la red de
calles. Las opciones eran un servicio en la nube (Mapbox, GraphHopper) o levantar uno propio.

## Decisión

**Valhalla** en Docker, construyendo sus tiles desde el extract de OpenStreetMap de Perú.

Lo que resuelve, y que es exactamente el alcance de la app:

- **Ruta con perfil de bicicleta de verdad** — evita vías rápidas, prefiere ciclovías, y con datos
  de elevación penaliza las subidas. En Lima, con los acantilados de la Costa Verde, esto no es un
  detalle.
- **Rutas alternativas** en una sola consulta, para comparar.
- **Isócronas** — "¿hasta dónde llego en 20 minutos?".
- **Ajuste del GPS a la vía**, para que el trazado guardado siga las calles en vez de zigzaguear
  con el error del GPS.

Un servicio en la nube arrancaría en minutos, pero con cuota limitada, dependencia de un tercero y
una clave desde el primer día. Para una app cuyo valor entero es el ruteo, tercerizar el ruteo es
tercerizar el producto.

## Consecuencias

**A favor**

- Sin costo por consulta ni límite de uso.
- Control total del perfil de ciclismo: se puede ajustar cuánto penaliza una subida o cuánto premia
  una ciclovía, y eso es donde la app se diferencia.
- Los datos y el motor son abiertos: nada se rompe porque un proveedor cambie de precios.

**En contra**

- **La primera construcción de tiles es lenta** —del orden de decenas de minutos— y con elevación
  activada descarga bastantes datos. Solo pasa una vez, pero conviene avisarlo en el README.
- **Consume RAM**: hay que contar con varios GB en la máquina que lo hospede, lo que descarta los
  planes de hosting más baratos.
- **Los datos de OSM envejecen.** Hay que decidir cada cuánto se reconstruyen los tiles; una
  ciclovía nueva no aparece sola.
- Es una pieza más de infraestructura que mantener y monitorear.

## Alternativas descartadas

Lo que se le pide al motor no es "una ruta", son cuatro cosas: perfil de bici **ajustable**
(premiar ciclovía, penalizar subida — el diferenciador del producto), **alternativas**, **ajuste
del GPS a la vía** y **isócronas**. Casi todo el campo se cae en alguna de las cuatro.

### Self-hosted

- **OSRM** — el más rápido de todos por lejos, C++, maduro. Se descartó porque precalcula el grafo
  con el perfil adentro (*contraction hierarchies*): cambiar cuánto premia una ciclovía obliga a
  reconstruir todo. Además no maneja elevación, sus alternativas son pobres y solo existen en modo
  MLD, y no tiene isócronas. Es el motor correcto para "la ruta más rápida en auto", que no es
  esto.
- **GraphHopper** — *el rival real*, y la decisión estuvo cerca. Perfiles de bici muy buenos,
  elevación con SRTM, *custom models* en JSON, alternativas, isócronas y map matching, todo en la
  versión abierta, y la mejor documentación del grupo. Se pagó por no tomarlo: la JVM como segunda
  cadena de herramientas en el repo, y la tensión entre sus dos modos — en modo rápido (CH) el
  perfil vuelve a quedar horneado, y para tunear en caliente hay que correr en modo flexible, que
  es más lento. Valhalla es dinámico por diseño, sin ese dilema.
- **BRouter** — el favorito de los ciclistas de verdad, con perfiles increíblemente afinables y
  capaz de correr offline en Android. Se descartó por lo demás: lenguaje de perfiles
  idiosincrático, sin isócronas ni map matching, proyecto de un solo autor y una API incómoda de
  integrar.
- **OpenRouteService** — GraphHopper con isócronas y APIs más amables, en Docker. Es una capa más
  sobre GraphHopper: builds lentos y bastante configuración, sin ganar nada que GraphHopper solo
  no diera.
- **pgRouting** — tentador porque no suma infraestructura: el ruteo viviría dentro del PostGIS que
  ya vamos a tener. Se descartó porque la topología la construyes y la mantienes tú, y no trae
  perfil de bici, ni indicaciones de giro, ni alternativas. Es una librería de grafos, no un
  producto de ruteo.

### Servicios en la nube

- **Mapbox Directions** — calidad alta y cero infraestructura. Se descartó por tres razones, y la
  tercera sola bastaba: sin tuneo real del perfil de bici, cobro por petición, y unos términos que
  **restringen guardar los resultados** — justo lo que hace el historial de recorridos.
- **Google Directions** — descartado sin más análisis: sus términos obligan a mostrar el resultado
  sobre un mapa de Google, lo que choca de frente con MapLibre ([0005](0005-expo-en-el-movil.md)).
- **Stadia Maps**, que hospeda Valhalla — no es tanto una alternativa como la **salida de
  emergencia**: habla la misma API que el Valhalla propio, así que si el self-host resulta
  demasiado caro de mantener, se cambia la URL base y nada más en el código se entera. Que exista
  esa salida es parte de por qué se eligió Valhalla y no otro.
