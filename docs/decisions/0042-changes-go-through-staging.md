# 0042 — Los cambios entran por `staging`; `main` solo recibe a `staging`

Aceptada · 2026-10-16 · Reemplaza en parte a 0021

## Contexto

0021 decidió ramas con PR directo a `main` y sin `staging`. En la práctica se integra en
`staging` y `main` no se toca: es lo que Dokploy despliega (0009, 0023).

## Decisión

```
feat/…  fix/…  docs/…  chore/…
              │  PR
              ▼
           staging      se integra y se prueba en el teléfono
              │  PR, cuando lo de staging anduvo
              ▼
            main        Dokploy despliega
```

- Las ramas salen de `staging` y vuelven a `staging` por PR.
- Un cambio chico de docs puede ir directo a `staging`.
- `main` solo recibe PR desde `staging`. El `pre-push` rechaza un push a `main`.
- `staging` es una rama, no un entorno: no tiene despliegue propio (0018).

## Se paga

- Dos PR entre el cambio y producción.
- `staging` queda detrás de `main` por los commits de merge. No cambian archivos.
- Lo que está en `staging` y no en `main` solo se prueba en local y en el teléfono.

## Descartado

- **PR directo a `main` (0021).** Cada merge sería un despliegue.
- **`staging` con su entorno en Dokploy.** Otro Valhalla compitiendo por la RAM (0018).
- **Todo directo en `staging`, sin ramas.** Se pierde el PR como lectura del diff entero.
