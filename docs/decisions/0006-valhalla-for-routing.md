# 0006 — Valhalla propio para calcular rutas

Aceptada · 2026-09-08

## Contexto

El valor de la app es la ruta en bici: por dónde, cuánto se tarda, qué alternativas hay. Hacía
falta un motor de ruteo, en la nube o propio.

## Decisión

Valhalla en Docker, con el grafo construido desde el extracto de OSM de Perú. Da:

- Perfil de bicicleta ajustable en cada petición: evitar avenidas, preferir ciclovías, penalizar
  subidas con datos de elevación.
- Rutas alternativas en una consulta.
- Isócronas.
- Ajuste del GPS a las calles.

Un servicio en la nube arranca en minutos, pero con cuota, dependencia y clave. Tercerizar el
ruteo es tercerizar el producto.

## Se paga

- Construir el grafo lleva minutos y RAM (medido en [infra](../../infra/README.md)).
- Los datos envejecen hasta que se reconstruye el grafo.
- Una pieza más que mantener.

## Descartado

- **OSRM.** El más rápido, pero el perfil va dentro del grafo: cambiarlo obliga a reconstruir. Sin
  elevación ni isócronas.
- **GraphHopper.** El rival real: buenos perfiles, elevación, alternativas e isócronas. Suma la
  JVM, y en su modo rápido el perfil también queda fijo.
- **BRouter.** Excelente para bici y corre offline en Android, pero sin isócronas ni ajuste de GPS,
  con un lenguaje de perfiles propio y un solo autor.
- **OpenRouteService.** Otra capa sobre GraphHopper, sin ganar nada.
- **pgRouting.** No suma infraestructura, pero no trae perfil de bici, giros ni alternativas.
- **Mapbox Directions.** Sin perfil ajustable, cobra por petición y restringe guardar resultados.
- **Google Directions.** Obliga a mostrar el resultado sobre un mapa de Google.
- **Stadia Maps.** Hospeda Valhalla con la misma API: no es alternativa sino salida de emergencia,
  cambiando la URL.
