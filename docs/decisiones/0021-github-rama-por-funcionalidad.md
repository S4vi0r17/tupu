# 0021 — GitHub, con rama por funcionalidad y pull request

**Estado:** Aceptada · 2026-09-08

## Contexto

El proyecto todavía no está en git. Y Dokploy despliega **tirando el código de un proveedor**
([0009](0009-despliegue-en-dokploy.md)), así que dónde vive el repositorio también condiciona el
despliegue.

Sobre las ramas, hay un hecho que manda: [0018](0018-sin-entorno-de-pruebas.md) dejó un solo
entorno, así que **`main` es producción**. Lo que entre ahí es lo que corre.

## Decisión

**GitHub**, y **rama por funcionalidad con pull request a `main`** — aunque los apruebe la misma
persona que los abrió.

```
main ─────●────────●────────●──→   producción
           \      /  \      /
            ●────●    ●────●       feat/compass, feat/route-planner…
```

Nada de `develop` ni `staging`: no hay un segundo entorno al que promover.

### Por qué PR habiendo un solo desarrollador

Porque **es el único momento en que el cambio se mira entero antes de tocar producción**. Un
commit directo se escribe mirando el archivo abierto; un PR obliga a leer el diff completo,
incluido lo que se coló sin querer. Y da el lugar donde colgar comprobaciones automáticas el día
que se quieran ([0023](0023-sin-ci-dokploy-despliega.md)).

## Consecuencias

**A favor**

- GitHub es lo mejor soportado por Dokploy y donde vive el ecosistema de Expo: menos caminos sin
  documentar cuando algo falle.
- El historial de `main` queda con una entrada por funcionalidad, no con el proceso de pensarla.
- La rama de trabajo permite dejar algo a medias sin romper nada.

**En contra**

- **Es ceremonia autoimpuesta y por lo tanto fácil de saltarse.** Nadie va a rechazar un PR.
  Vale lo que valga la disciplina de leerse el diff.
- Abrir y mergear un PR para un cambio de una línea es desproporcionado, y va a pasar seguido.
- El código vive en un servicio de terceros, lo que se aparta del criterio auto-hospedado del
  resto del stack.

## Alternativas descartadas

- **Directo a `main`** — cero ceremonia, defendible con un solo desarrollador. Se descartó porque
  cada commit iría a producción sin ningún filtro y no quedaría dónde enganchar comprobaciones
  después.
- **`develop` → `staging` → `main`**, como el repo hermano `fulfillment-api`, que la fuerza con un
  workflow guardián. Se descartó porque esa cadena resuelve un problema que tupu no tiene: allí
  hay entornos que corresponden a cada rama y varias personas mergeando. Aquí `staging` sería una
  rama sin entorno detrás, o sea ceremonia pura.
- **Gitea o Forgejo auto-hospedado** en el mismo VPS — coherente con el resto del stack y sin
  depender de nadie. Se descartó porque suma un servicio al VPS que ya comparte RAM con Valhalla
  ([0006](0006-valhalla-para-ruteo.md)), y porque perder GitHub aquí no cuesta nada: el código es
  público en potencia y el historial está en local.
