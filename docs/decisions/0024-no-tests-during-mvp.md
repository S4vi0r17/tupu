# 0024 — Sin tests durante el MVP

Aceptada · 2026-09-08

## Contexto

Los errores que no avisan están en `packages/geo`: el ángulo, la distancia, decodificar una ruta.
Si el ángulo está mal por 10°, nada falla: la flecha apunta mal y se descubre pedaleando.

## Decisión

Sin tests durante el MVP. El día que el primer error de cálculo llegue a la calle, se escriben los
tests de `packages/geo` antes de arreglarlo.

## Se paga

- `packages/geo` son funciones puras: lo más barato de testear y lo más caro de depurar.
- Un error de cálculo no deja excepción ni log: «la app anda rara».
- Ningún refactor tiene red.
- Los tests llegarán sobre más código, parte difícil de testear.

## Descartado

- **Testear `packages/geo` y los `service.ts` con `bun test`.** Poca infraestructura y cubre los
  errores silenciosos. Es lo primero a revisar.
- **Además, e2e del API contra Postgres.** Desproporcionado para el momento.
