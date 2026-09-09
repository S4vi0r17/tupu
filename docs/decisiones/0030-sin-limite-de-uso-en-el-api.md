# 0030 — Sin límite de uso en el API, con disparador

**Estado:** Aceptada · 2026-09-08

## Contexto

[0009](0009-despliegue-en-dokploy.md) es explícito en que **Valhalla nunca se expone**: un motor de
ruteo abierto es CPU gratis para quien lo encuentre. Pero el API que está delante **sí es público**,
y como el MVP no tiene cuentas ([0010](0010-alcance-del-mvp.md)) tampoco tiene puerta:
`POST /routes/plan` lo puede llamar cualquiera, tantas veces como quiera.

El problema no se evitó con 0009: se movió una capa arriba. Y sobre un VPS único donde el API
comparte RAM con PostGIS y Valhalla ([0018](0018-sin-entorno-de-pruebas.md)), saturar el ruteo tumba
todo lo demás con él.

## Decisión

**No se pone límite de uso durante el MVP.**

El razonamiento es que mientras la URL solo la conozca quien escribió la app, no hay superficie de
ataque real. Nadie escanea buscando un API de ciclovías en Lima.

### El disparador, y es más cercano de lo que parece

> **Antes de pasarle el APK a cualquier otra persona.**

No es una fecha vaga: **el APK lleva la URL del API dentro**, así que repartirlo es publicar la
URL. Y repartirlo está en el plan — [0019](0019-mvp-solo-android.md) dice, textualmente, que el APK
se pasa «a conocidos con teléfonos de distintas marcas», que es justo lo que
[0015](0015-grabacion-en-segundo-plano.md) necesita para validar la grabación en segundo plano.

Es decir: **el disparador se va a cumplir durante el MVP, no después.** Conviene tenerlo presente y
no descubrirlo el día que se reparte.

## Consecuencias

**A favor**

- Cero trabajo hoy, y el trabajo evitado es real: elegir dónde poner el freno, escribirlo y
  probarlo.
- Sin riesgo de bloquearse uno mismo con un límite mal calibrado mientras se desarrolla, que es
  molesto justo cuando más peticiones se hacen.

**En contra**

- **Una sola persona con un bucle puede tumbar el VPS entero**, no solo el ruteo: el API, la base y
  Valhalla comparten máquina.
- **No hay forma de enterarse.** Sin límite tampoco hay contador, así que el primer síntoma sería
  que la app va lenta o el servidor no responde, sin saber por qué.
- El disparador depende de acordarse. Queda anotado en
  [`../planeacion.md`](../planeacion.md) como bloqueante, no como pendiente suelto.

## Alternativas descartadas

- **Middleware de límite por IP en Hono**, más estricto en planificar ruta que en listar ciclovías.
  Era la recomendación: vive en el repo, se versiona, y sabe qué endpoint cuesta caro. Se descartó
  por ahora por velocidad, y es lo primero que hay que poner cuando salte el disparador.
- **Límite por IP en Traefik** — frena antes de llegar al código, así que protege también de una
  avalancha que tumbaría el proceso. Se descartó porque se configura fuera del repo y trata todos
  los endpoints igual.
- **Una clave compartida dentro de la app** — corta el escaneo automático, pero se extrae de un APK
  con herramientas comunes, así que sube el listón sin cerrar la puerta. Solo tiene sentido junto a
  un límite de verdad.
