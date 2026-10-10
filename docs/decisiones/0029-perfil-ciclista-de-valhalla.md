# 0029 — Perfil ciclista: prioriza ciclovía y evita subidas

Aceptada · 2026-09-08 · Valores de partida, se afinan pedaleando

## Contexto

Valhalla le pone un costo a cada tramo (tiempo, tráfico, pavimento, subida, giros) y busca el
camino más barato. Los pesos viajan en cada petición (0006), pero nunca se dijo cuáles. Con los de
fábrica, la ruta se parece a la de cualquier app.

## Decisión

```jsonc
{
  "bicycle_type": "Hybrid",     // bici urbana
  "cycling_speed": 18,          // km/h en llano
  "use_roads": 0.2,             // bajo: prefiere ciclovía aunque alargue
  "use_hills": 0.2,             // bajo: bordea las subidas
  "avoid_bad_surfaces": 0.5
}
```

Rutas más largas y más tranquilas: es la premisa de la app escrita en números. Viven en
`features/routing/service.ts`. Afinarlos es tocar un archivo, sin reconstruir el grafo.

Están puestos a ojo. Cuando se corrijan, se anota acá qué cambió y por qué.

## Se paga

- `use_roads` muy bajo puede dar rodeos absurdos para llegar a una ciclovía.
- La red de OSM en Lima tiene huecos, y un perfil que prioriza ciclovías los amplifica.
- `use_hills` solo funciona si el grafo se construyó con elevación.
- `cycling_speed` es un promedio inventado: los tiempos estarán sesgados hasta compararlos con
  recorridos reales.

## Descartado

- **Los valores de fábrica.** Menos riesgo de rutas raras, y ninguna diferencia con otras apps.
- **Un perfil rápido.** Contradice el motivo de la app.
- **Dar los mandos al usuario.** Aplazado: primero hay que saber qué valores son buenos.
