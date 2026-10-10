# 0023 — Sin CI: Dokploy despliega al mergear

Aceptada · 2026-09-08

## Contexto

Dokploy construye y despliega cuando cambia `main`, pero no corre comprobaciones. Faltaba decidir
qué verifica el código antes.

## Decisión

Sin CI. Las comprobaciones se corren en local antes del PR:

```sh
bun run check
```

Se agrega `.github/workflows/ci.yml` cuando haya tests, o cuando un despliegue roto cueste una
tarde.

## Se paga

- El PR no verifica nada solo.
- La primera señal automática es la build de Docker fallando, con el merge ya hecho.
- Un merge en mal momento despliega igual (0018).

## Descartado

- **GitHub Actions con typecheck y lint.** Gratis y medio minuto por PR. Es lo primero a revisar.
- **Hook de pre-commit.** Hace lento cada commit y se salta con `--no-verify`.
