# 0020 — Los datos de OSM se actualizan con un solo comando, a mano

**Estado:** Aceptada · 2026-09-08

## Contexto

El extracto de Perú de OSM alimenta **dos cosas distintas**, y es fácil confundirlas porque las
dos se llaman "tiles" ([glosario](../glosario.md)):

```
Extracto de Perú (.pbf de OSM)
        │
        ├──→ filtrar ciclovías ──→ PostGIS      "¿qué ciclovías hay cerca de mí?"
        │
        └──→ construir el grafo ─→ Valhalla     "¿cómo llego hasta allá?"
```

La primera rama ya está decidida ([0012](0012-ingesta-de-osm-por-extracto.md)). Faltaba la segunda:
[0009](0009-despliegue-en-dokploy.md) estableció que el grafo de ruteo **no puede construirse en
cada despliegue** —son decenas de minutos y varios GB— pero no cuándo sí.

Si las dos ramas se actualizan por caminos separados, se desincronizan: el mapa mostraría una
ciclovía que el motor de ruteo no conoce, o al revés.

## Decisión

**Un solo comando, corrido a mano en el VPS**, que hace las dos ramas desde la misma descarga:

```
bun run osm:update
  1. descarga el .pbf de Perú de Geofabrik
  2. filtra ciclovías → carga en PostGIS, reemplazando en una transacción
  3. construye el grafo de Valhalla en un directorio nuevo
  4. cambia el motor al directorio nuevo y borra el viejo
```

Los pasos 2 y 4 dejan el sistema servible durante todo el proceso: se construye al lado y se
cambia al final. Si algo falla a la mitad, siguen valiendo los datos viejos.

Sigue el mismo criterio que [0012](0012-ingesta-de-osm-por-extracto.md): **a mano ahora, el cron
después es el mismo comando**. No hay nada que rehacer para automatizarlo.

## Consecuencias

**A favor**

- **Imposible que el mapa y el ruteo queden desincronizados**: salen de la misma descarga, en la
  misma corrida.
- Un solo comando que recordar, en vez de dos procedimientos.
- Construir al lado y cambiar al final significa que actualizar no implica una ventana sin servicio.

**En contra**

- **Durante la construcción el VPS va apretado.** Son decenas de minutos con el grafo nuevo y el
  viejo ocupando RAM y disco a la vez, mientras el API sigue atendiendo. Hay que dimensionar el
  VPS contando con ese pico, no con el uso normal.
- **Hace falta el doble de disco** del que ocupa el grafo, por la misma razón.
- Es un paso manual, y los pasos manuales se olvidan. Los datos de OSM van a envejecer hasta que
  alguien se acuerde.
- Correrlo requiere entrar al VPS. No es un botón.

## Alternativas descartadas

- **Construir el grafo en la máquina de desarrollo y subirlo** — el VPS nunca sufriría el pico de
  RAM ni los minutos de CPU. Se descartó por dos razones: obliga a subir varios GB por una conexión
  doméstica cada vez, y separa las dos ramas del diagrama en caminos distintos, que es exactamente
  la desincronización que la decisión evita. Queda como salida si el pico de RAM resulta
  inaceptable en el VPS que se contrate.
- **Cron mensual automático** — aplazado, no descartado, igual que en
  [0012](0012-ingesta-de-osm-por-extracto.md). Es el mismo comando; correrlo solo solo añade hoy el
  riesgo de que falle de madrugada sin que nadie mire.
