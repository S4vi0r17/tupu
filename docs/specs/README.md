# Specs

Lo que la app garantiza, regla por regla. Se escribe antes que el código (0043): un archivo
Markdown por área, sin herramientas.

| Archivo | Área |
|---|---|
| [`route.md`](route.md) | `ROUTE`: inicio y destino, el API de ruteo y lo que ve el usuario |
| [`cycleways.md`](cycleways.md) | `CYCLE`: clases de la red, ingesta y cómo viaja |
| [`compass.md`](compass.md) | `COMPASS`: el cono y los avisos de la brújula |
| [`camera.md`](camera.md) | `CAMERA`: los tres modos y cuándo se mueve |

Las que vienen (0040): `VOICE`, `RIDE` (grabación), `SPEED` (velocímetro) y `AWAKE` (pantalla
encendida).

## Proceso

1. Leer la spec del área. Si la regla nueva contradice una vigente o una decisión, parar y
   preguntar.
2. Escribir o corregir la regla con la plantilla de abajo.
3. Implementar hasta cumplir cada criterio.
4. Verificar cada criterio y anotar cómo y cuándo.
5. Commitear spec, código y docs juntos ([workflow.md](../conventions/workflow.md)).

Un refactor que no cambia comportamiento no necesita regla, pero no puede romper las que toca.

## Un buen criterio

- Entrada concreta y salida observable: `-77.0301, -12.1211` → destino en `-12.1211, -77.0301`.
- Los dos lados de cada límite: 2,9° no mueve la cámara, 3° sí.
- El código HTTP o el texto real que ve el usuario.

Si no se puede verificar, no es un criterio.

## Verificación, sin tests (0024)

| Qué | Cómo |
|---|---|
| Función pura | `bun -e` con los valores del criterio |
| API | `curl` contra `bun run dev:api` o desarrollo |
| Pantalla | En el teléfono |
| GPS, brújula, voz | En la calle, con fecha |

Lo que no se pudo verificar queda «sin verificar».

## Plantilla

IDs `SPEC-<AREA>-<NN>`. No se reutilizan ni se renumeran; una regla retirada queda `Derogada`.

```md
# SPEC-<AREA> — <Tema>

**Origen:** <decisiones, como 0028>.

---

## SPEC-<AREA>-01 — <La regla en una frase afirmativa>

**Código:** `<archivos>`

### Criterios

1. <Entrada concreta y salida observable.>

### Verificación

<Cómo y cuándo, o «sin verificar».>
```

Las rutas de `apps/mobile/` y `apps/api/src/` van sin ese prefijo.
