# 0033 — Drizzle también en el teléfono

Aceptada · 2026-09-08

## Contexto

0013 sumó SQLite en el teléfono sin decir cómo se consulta. Por defecto quedaría SQL suelto: dos
estilos en un repo que eligió Drizzle para tener uno (0007).

## Decisión

Drizzle sobre `expo-sqlite`, con `drizzle-kit` para las migraciones.

Sus live queries resuelven algo concreto: la pantalla de grabación se redibuja sola cuando la tarea
de fondo inserta un punto (0015), sin escribir esa comunicación a mano.

## Se paga

- Otra configuración de migraciones: en Expo se empaquetan en la app y se aplican al arrancar.
- Una dependencia más en la app.
- Desproporcionado para dos tablas.
- El soporte para Expo tiene menos rodaje que el de Postgres.

## Descartado

- **SQL con `expo-sqlite`.** Una capa menos, pero sin live queries.
