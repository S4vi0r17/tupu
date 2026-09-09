# 0024 — Sin tests durante el MVP

**Estado:** Aceptada · 2026-09-08

## Contexto

Los tests se aplazaron a propósito hasta el final de la planeación, para decidirlos sabiendo qué
hay que testear. Con el MVP ya definido ([0010](0010-alcance-del-mvp.md)) la pregunta concreta era
dónde se esconden los errores que no se quejan.

En esta app están en la matemática de `packages/geo`: el ángulo hacia el destino, la distancia
entre dos puntos, decodificar el trazado de una ruta. Si el ángulo está mal por 10°, **nada falla**
— la flecha simplemente apunta mal, y eso se descubre pedaleando y dudando de uno mismo.

## Decisión

**No hay tests durante el MVP.**

El disparador para revisitarlo, escrito: **el primer error de cálculo que llegue a la calle**. Es
decir, la primera vez que la flecha, los kilómetros o la ruta estén mal y no se sepa desde cuándo.
Ese día se escriben los tests de `packages/geo` antes de arreglar el error, para que el arreglo
tenga red.

## Consecuencias

**A favor**

- Se avanza más rápido hasta tener algo que probar en la calle, que es lo que este MVP busca.
- Los tests se escribirían hoy contra un diseño que todavía va a cambiar; escritos después, se
  escriben contra lo que quedó.

**En contra**

- **`packages/geo` es exactamente lo que más barato sería testear y más caro es depurar.** Son
  funciones puras, sin base ni red: un test es tres líneas y no necesita infraestructura. Se está
  renunciando al caso más favorable que tiene el proyecto.
- **Un error de cálculo no avisa.** No hay excepción, no hay log, no hay pantalla roja. Se
  manifiesta como "la app anda rara", que es la clase de síntoma más cara de rastrear.
- **Ningún refactor tendrá red.** Cambiar cómo se decodifica un trazado o cómo se suman los
  kilómetros va a ser a ojo.
- Cuando lleguen los tests habrá más código que cubrir, y parte estará escrito de una forma que
  cuesta testear.

Nada de esto invalida la decisión —es un proyecto personal sin usuarios y el MVP se prueba
saliendo en bici— pero conviene tenerlo escrito para que la elección sea consciente y no un olvido.

## Alternativas descartadas

- **Testear solo lo que decide algo** — `packages/geo` y las reglas de los `service.ts`, con
  `bun test`, que ya viene incluido ([0001](0001-monorepo-con-bun.md)). Era la recomendación:
  poquísima infraestructura y cubre justo donde están los errores silenciosos. Se descartó por
  velocidad durante el MVP, y es la primera candidata a revisitar.
- **Eso más e2e del API contra Postgres real** en Docker, como el repo hermano `fulfillment-api`.
  Atraparía los errores de consulta espacial, que son fáciles de escribir mal. Se descartó por
  desproporción con el momento del proyecto.
