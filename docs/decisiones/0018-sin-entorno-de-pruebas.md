# 0018 — Sin entorno de pruebas: solo producción y local

**Estado:** Aceptada · 2026-09-08

## Contexto

Lo habitual es tener un *staging*: una copia completa del sistema donde se prueba antes de tocar
producción. Con [0009](0009-despliegue-en-dokploy.md) eso significaría un segundo proyecto de
Dokploy con su propia base y su propio Valhalla.

## Decisión

**Solo producción.** Todo se prueba en local, con el mismo `docker compose` que corre en el VPS.

Dos razones concretas:

- **Valhalla es glotón de RAM** ([0006](0006-valhalla-para-ruteo.md)). Duplicarlo en el mismo VPS
  compite con producción por el recurso más escaso, y en otro VPS duplica el costo mensual.
- **No hay usuarios que proteger.** El daño de romper producción hoy es que el proyecto personal
  deja de funcionar un rato para su único usuario, que es además quien lo rompió.

El disparador para cambiar, escrito: **cuando haya gente usando la app**.

## Consecuencias

**A favor**

- Un solo entorno que mantener, actualizar y vigilar.
- El `docker compose` local es el mismo que el desplegado, así que se prueba contra algo fiel de
  verdad — más fiel que un staging que va derivando.

**En contra**

- **Un despliegue malo se ve en producción**, no antes. Con un solo usuario es molesto, no grave.
- **Las migraciones de base se prueban en local contra datos de juguete.** El día que haya datos
  reales y volumen, una migración puede comportarse distinto y no habrá dónde ensayarla.
- El propio Dokploy y su configuración se prueban en caliente.

## Alternativas descartadas

- **Staging en el mismo VPS** — despliegues reales de ensayo por poco dinero. Se descartó por la
  RAM: es justo lo que no sobra con Valhalla en medio.
- **Staging en un VPS aparte** — aislamiento de verdad, lo correcto de manual. Se descartó por
  costo y mantenimiento duplicados para un proyecto sin usuarios.
