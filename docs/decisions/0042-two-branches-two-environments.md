# 0042 — Dos ramas, dos entornos: `develop` despliega desarrollo, `main` producción

Aceptada · 2026-10-16 · Reemplaza a 0018 y en parte a 0021

## Contexto

Un cambio del API solo se podía probar en la calle después de llegar a producción: en la calle, el
teléfono no alcanza la laptop. 0018 descartó un segundo entorno por la RAM de Valhalla, pero en
reposo los tres servicios usan unos 300 MiB (medido el 2026-10-10). Lo caro es construir el grafo:
3,1 GiB de pico.

## Decisión

```
develop ── commit ── push ──▶ desarrollo   tupu-api-dev.s4vi0r.dev
   │
   └── PR, cuando anduvo en la calle ──▶ main ──▶ producción   tupu-api.s4vi0r.dev
```

- Se trabaja directo en `develop`. Una rama aparte solo si el cambio puede quedar a medias días.
- Cada push a `develop` despliega desarrollo. Un PR de `develop` a `main` despliega producción.
- Después, `git pull origin main` en `develop`: avanza rápido y las dos quedan iguales.
- El `pre-push` rechaza un push a `main` y corre `bun run check`.
- Los dos entornos son el mismo `compose.prod.yaml` en Dokploy, con sus variables, su dominio y
  sus datos.

## Se paga

- Unos 300 MiB de RAM y 1 GB de disco más.
- El grafo se construye en cada entorno, nunca en los dos a la vez: dos picos no entran en 4 GB.
- Un APK por entorno: la URL va dentro (0030). En el mismo teléfono, el segundo pide otro
  package id.
- Sin PR por cambio: lo que entra a `develop` se lee entero en el PR a `main`.

## Descartado

- **Ramas por cambio, con PR a `develop` (0021).** Dos PR entre el cambio y producción.
- **Valhalla compartido entre los dos entornos.** Menos disco, pero una red de Docker entre
  entornos y ningún lugar donde probar una versión nueva de Valhalla.
- **Sin entorno de desarrollo (0018).** El API se probaría en la calle recién en producción.
- **`staging` como nombre.** Suena a un entorno de pruebas aparte; `develop` dice lo que es.
