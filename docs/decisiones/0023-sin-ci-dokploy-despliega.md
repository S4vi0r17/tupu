# 0023 — Sin CI: Dokploy despliega al mergear

**Estado:** Aceptada · 2026-09-08

## Contexto

Con el repositorio en GitHub ([0021](0021-github-rama-por-funcionalidad.md)) quedaba decidir qué
comprueba una máquina antes de que el código llegue al VPS.

Conviene separar dos cosas que se confunden:

- **Despliegue** — construir la imagen y ponerla a correr. Eso lo hace Dokploy solo, con un
  webhook, en cuanto `main` cambia.
- **Integración continua (CI)** — correr typecheck, lint y tests para saber si el cambio está
  sano. Eso **Dokploy no lo hace**: construye y despliega.

## Decisión

**No hay CI.** Dokploy despliega automáticamente al mergear a `main`, y no hay nada corriendo en
GitHub Actions.

Las comprobaciones se corren a mano en local antes de abrir el PR:

```bash
bun run typecheck && bun run lint
```

## Consecuencias

**A favor**

- Cero configuración de CI que escribir y mantener antes de tener código.
- Mergear y desplegar son un solo acto: no hay un botón que apretar ni un paso manual que
  olvidar.

**En contra**

- **El pull request de [0021](0021-github-rama-por-funcionalidad.md) no comprueba nada
  automáticamente.** Es una puerta de lectura, no de verificación. Vale exactamente lo que valga
  la disciplina de correr los comandos antes.
- **La primera señal automática de que algo está roto es la build de Docker fallando**, y para
  entonces el merge ya está hecho. Con `tsc` dentro del Dockerfile un error de tipos al menos
  impide desplegar; el lint no se mira nunca.
- Un merge en mal momento despliega igual. No hay staging donde absorberlo
  ([0018](0018-sin-entorno-de-pruebas.md)).
- Cuando existan tests, no habrá nada que los corra salvo acordarse.

**La salida está a un archivo de distancia.** Añadir `.github/workflows/ci.yml` con typecheck y
lint son unos treinta segundos por PR y no cambia nada de lo demás. Queda anotado como pendiente
con disparador: **el día que haya tests, o el día que un despliegue roto cueste una tarde.**

## Alternativas descartadas

- **Actions en el PR con typecheck y lint** — es gratis, tarda medio minuto y hace que el PR
  signifique algo. Se descartó ahora por no configurar infraestructura antes de que exista código
  que comprobar, no porque el argumento sea malo. Es la primera candidata a revisitar.
- **Hook de pre-commit** que corra typecheck y lint en local antes de dejar commitear. Se descartó
  porque hace lento cada commit, se salta con `--no-verify`, y no protege nada del lado del
  servidor.
