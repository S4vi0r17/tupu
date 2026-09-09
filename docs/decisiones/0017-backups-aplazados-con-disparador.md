# 0017 — Backups aplazados, con disparador escrito

**Estado:** Aceptada · 2026-09-08

## Contexto

[0011](0011-postgis-desde-el-inicio.md) obligó a salir de la plantilla de base de datos de Dokploy
para poder usar PostGIS, y con eso se perdieron sus backups automáticos. Quedaba montar un
`pg_dump` propio.

Antes de montarlo conviene preguntarse **qué hay realmente en la base durante el MVP**:

| Dato | Dónde vive | ¿Se puede recuperar? |
|---|---|---|
| Red de ciclovías | Postgres | **Sí**, corriendo `bun run ingest` ([0012](0012-ingesta-de-osm-por-extracto.md)) |
| Recorridos del usuario | El teléfono, en SQLite ([0013](0013-recorrido-en-sqlite-local.md)) | No aplica, no está en el servidor |
| Cuentas de usuario | No existen todavía ([0010](0010-alcance-del-mvp.md)) | — |

**La base del MVP no contiene nada irreemplazable.** Un backup de ella sería una copia de datos
que se regeneran con un comando.

## Decisión

**No hay backups todavía.** El disparador queda escrito y es inequívoco:

> El día que exista la primera cuenta de usuario en la base, los backups son **requisito previo**
> a desplegar esa funcionalidad. No después.

Eso es porque el primer dato irrecuperable del proyecto no es una ciclovía: es la cuenta de
alguien y su historial sincronizado.

## Consecuencias

**A favor**

- No se monta ni se mantiene infraestructura que hoy no protege nada.
- El disparador está atado a un hecho verificable —existe la tabla de usuarios— y no a una
  sensación de "ya deberíamos".

**En contra**

- **Es fácil que el disparador se pase por alto** en el momento, que es justo cuando importa.
  Queda anotado en la planeación como bloqueante, no como pendiente suelto.
- Si el VPS se pierde entero hoy, hay que reconstruir todo desde cero: base, extracto, tiles de
  ruteo. Son horas de máquina, pero ningún dato perdido.
- El script de `pg_dump` habrá que escribirlo y **probar la restauración** bajo presión, en vez de
  con calma ahora. Un backup que nunca se restauró no es un backup.

## Alternativas descartadas

- **`pg_dump` diario a S3 o Backblaze desde ya** — el hábito y el script quedarían hechos y
  probados antes de que haya algo que perder, que es un argumento real. Se descartó porque hoy
  copiaría datos regenerables, y porque el script habrá que revisarlo igual cuando el esquema tenga
  usuarios.
- **Snapshots del VPS del proveedor** — cubren base, tiles de ruteo y configuración de una sola
  vez, sin escribir nada. Se descartó porque restaurar es todo o nada, suele cobrarse aparte, y no
  resuelve el caso que de verdad importará: recuperar *una tabla* sin volver atrás el sistema
  entero.
