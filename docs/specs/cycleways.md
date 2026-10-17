# SPEC-CYCLE — Red ciclista en el mapa

**Origen:** 0012, 0020, 0038, 0041.

---

## SPEC-CYCLE-01 — Cada tramo cae en una de tres clases

**Código:** `features/cycleways/ingest.ts`, `components/cycleway-layers.tsx`, `components/map-legend.tsx`

En `cycleway`, `cycleway:both`, `cycleway:left` o `cycleway:right`. La primera que aplica gana.

| Clase | Cuándo | Se dibuja |
|---|---|---|
| `track` | `highway=cycleway`, o `track` en alguna de las cuatro | Verde continuo con halo blanco |
| `lane` | `lane` u `opposite_lane` en alguna | Verde punteado, más fino |
| `shared` | El resto de lo filtrado | Ámbar punteado |

### Criterios

1. Un tramo con `cycleway:right=track` y `cycleway:left=lane` es `track`.
2. Un tramo con `cycleway:left=lane` es `lane`.
3. Un tramo con `bicycle=designated` y nada más es `shared`.
4. La leyenda muestra las tres clases con el mismo color y trazo que el mapa.

### Verificación

1 a 3: lectura de `ingest.ts`, 2026-10-16. Hoy `opposite_track` cae en `shared` (`roadmap.md`).
4: en el teléfono.

---

## SPEC-CYCLE-02 — Una ingesta que encoge la red a menos de la mitad se revierte

**Código:** `features/cycleways/ingest.ts`

### Criterios

1. Con 2338 tramos en la corrida anterior, una de 1168 se revierte y deja la tabla como estaba.
2. Una de 1169 se acepta y queda en `osm_imports` con la fecha del extracto.

### Verificación

Lectura de `ingest.ts`, 2026-10-16. Sin correrlo contra una red encogida.

---

## SPEC-CYCLE-03 — La red viaja entera en una petición

**Código:** `features/cycleways/queries.ts`, `lib/cycleways.ts`

### Criterios

1. `GET /v1/cycleways` devuelve un `FeatureCollection` con todos los tramos, simplificados a unos
   dos metros y con cinco decimales.
2. Con gzip pesa menos de 100 KB: 84 KB con 2338 tramos.
3. La app la pide una vez por sesión.
4. Si falla, el aviso dice «No se pudo traer la red ciclista. El mapa base sigue funcionando.»

### Verificación

1 y 2: medido para 0041. 3 y 4: sin verificar en el teléfono.
