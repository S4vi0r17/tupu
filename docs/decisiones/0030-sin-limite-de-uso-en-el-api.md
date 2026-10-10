# 0030 — Sin límite de uso en el API, con disparador

Aceptada · 2026-09-08

## Contexto

Valhalla no se expone (0009), pero el API delante sí, y sin cuentas (0010) cualquiera puede pedir
rutas sin límite. En un VPS compartido, saturar el ruteo tumba todo.

## Decisión

Sin límite mientras la URL la conozca solo quien escribe la app.

Disparador: antes de pasarle el APK a otra persona. El APK lleva la URL dentro, así que repartirlo
es publicarla, y repartirlo está en el plan (0019).

## Se paga

- Un bucle de una sola persona puede tumbar el VPS entero.
- Sin límite tampoco hay contador: el síntoma sería lentitud sin explicación.
- El disparador depende de acordarse: es bloqueante en la planeación.

## Descartado

- **Límite por IP en Hono, más estricto en rutas.** Vive en el repo y sabe qué cuesta caro. Es lo
  primero cuando salte el disparador.
- **Límite en Traefik.** Fuera del repo y trata todos los endpoints igual.
- **Clave compartida en la app.** Se extrae del APK; solo sirve junto a un límite real.
