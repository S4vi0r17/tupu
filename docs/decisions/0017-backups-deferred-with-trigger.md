# 0017 — Backups aplazados, con disparador

Aceptada · 2026-09-08

## Contexto

PostGIS va dentro del compose y no tiene los backups de Dokploy (0011). Pero en el MVP la base no
guarda nada irreemplazable:

| Dato | Dónde | ¿Se recupera? |
|---|---|---|
| Red ciclista | PostGIS | Sí, con `osm:update` |
| Recorridos | El teléfono (0013) | No están en el servidor |
| Cuentas | No existen (0010) | — |

## Decisión

Sin backups por ahora. El día que exista la primera cuenta de usuario, los backups son requisito
para desplegarla.

## Se paga

- El disparador se puede pasar por alto justo cuando importa: está como bloqueante en la
  planeación.
- Si se pierde el VPS hoy, hay que reconstruir todo: horas de máquina, ningún dato.
- El script habrá que escribirlo y probar la restauración con prisa.

## Descartado

- **`pg_dump` diario desde ya.** Copiaría datos que se regeneran con un comando.
- **Snapshots del VPS.** Restaurar es todo o nada, y no recupera una tabla sola.
