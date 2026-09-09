# 0033 — Drizzle también en el teléfono

**Estado:** Aceptada · 2026-09-08

## Contexto

[0007](0007-drizzle-para-acceso-a-datos.md) eligió Drizzle para el servidor, y uno de sus argumentos
fue tener **un solo estilo de acceso a datos en todo el repo**.
[0013](0013-recorrido-en-sqlite-local.md) añadió después una segunda base —SQLite en el teléfono—
sin decir con qué se habla con ella, así que por defecto habría quedado SQL crudo y el repo tendría
dos estilos: exactamente lo que 0007 quería evitar.

## Decisión

**Drizzle también en el móvil**, sobre `expo-sqlite`.

El mismo estilo de consultas y el mismo `drizzle-kit` para generar migraciones, en las dos bases.

Y hay un argumento que no existía cuando se decidió 0013: **las *live queries* de Drizzle para Expo
SQLite**. La pantalla de grabación se suscribe a la consulta de puntos y se redibuja sola cada vez
que la tarea de fondo inserta uno ([0015](0015-grabacion-en-segundo-plano.md)), sin escribir ningún
mecanismo de notificación entre la tarea y la interfaz. Eso es trabajo real que desaparece.

## Consecuencias

**A favor**

- **Un solo estilo de acceso a datos en las dos bases**, que es literalmente el argumento con el que
  se eligió Drizzle ([0007](0007-drizzle-para-acceso-a-datos.md)).
- Las filas del historial llegan tipadas sin escribir los tipos a mano, y renombrar una columna del
  esquema local rompe en compilación.
- Las *live queries* resuelven gratis la comunicación entre la tarea de fondo y la pantalla, que
  era un problema no trivial.
- El esquema local queda escrito en TypeScript junto al código que lo usa, no en un `.sql` suelto.

**En contra**

- **Una segunda configuración de migraciones**, distinta de la del servidor: en Expo las migraciones
  se generan con `drizzle-kit` y hay que empaquetarlas en la app para aplicarlas al arrancar. Es un
  paso más en el build y una fuente de error nueva.
- Una dependencia más en el bundle del móvil, que ya suma Zod
  ([0032](0032-zod-en-contracts.md)) y TanStack Query ([0014](0014-expo-router-zustand-tanstack-query.md)).
- **Es desproporcionado para lo que hay**: dos tablas y un puñado de consultas. La ceremonia llega
  antes que el beneficio, igual que con los `packages/` de [0002](0002-layout-del-repo.md).
- El soporte de Drizzle para Expo SQLite tiene menos rodaje que el de Postgres, y
  [0007](0007-drizzle-para-acceso-a-datos.md) ya avisa de que Drizzle ha roto cosas entre versiones
  menores.

## Alternativas descartadas

- **SQL plano con `expo-sqlite`** — son dos tablas: una capa menos que instalar, configurar y
  actualizar. Se descartó por los dos argumentos de arriba, y sobre todo por las *live queries*: sin
  ellas hay que escribir a mano cómo se entera la pantalla de que la tarea de fondo insertó un
  punto.
