# 0031 — Biome para lint y formato

**Estado:** Aceptada · 2026-09-08

## Contexto

[0002](0002-layout-del-repo.md) dice que la regla de dependencia —`apps/*` puede importar de
`packages/*`, nunca al revés, y las apps no se importan entre sí— «se hace cumplir con el linter,
no se queda en buena intención dentro de un README».
[0008](0008-apps-api-por-funcionalidad.md) repite la promesa un nivel más abajo: una feature no
entra a los internos de otra.

**Nunca se eligió el linter.** Hasta que se elija, las dos reglas son exactamente lo que esas
decisiones dijeron que no querían ser.

Hay además una razón concreta para que importe aquí más que en otros proyectos:
[0001](0001-monorepo-con-bun.md) advierte que el `node_modules` aplanado de Bun **no aísla nada** —
el móvil puede importar el cliente de Postgres y en desarrollo no falla, porque está hoisteado en la
raíz. La regla de lint no es higiene: es lo único que evita ese fallo.

## Decisión

**Biome**, para lint y formato, en todo el monorepo.

Una sola herramienta en vez de dos: reemplaza a ESLint y a Prettier a la vez. Escrita en Rust, con
poca configuración y muy rápida, lo que importa cuando `bun run lint` se corre a mano antes de cada
PR — porque no hay CI que lo corra por uno ([0023](0023-sin-ci-dokploy-despliega.md)).

La regla de dependencia se expresa con `noRestrictedImports` por zonas de rutas.

> **A verificar al configurarlo**, y es la parte que puede fallar: que `noRestrictedImports` alcance
> también para la regla fina de [0008](0008-apps-api-por-funcionalidad.md) —una feature no importa
> los internos de otra, solo su `index.ts`— sin volverse una lista inmanejable de patrones. Si no
> alcanza, la alternativa descartada abajo pasa a ser la elegida.

## Consecuencias

**A favor**

- **Una herramienta, un archivo de configuración, un comando.** Sin la fricción clásica de ESLint y
  Prettier peleándose por las mismas reglas de formato.
- Rápido de verdad, que es lo que hace que se corra en vez de saltárselo.
- Formatea también el código del móvil: un solo criterio en todo el repo
  ([0002](0002-layout-del-repo.md)).

**En contra**

- **Su ecosistema de plugins es mucho más chico que el de ESLint.** No hay equivalente a
  `eslint-plugin-boundaries`, que está hecho exactamente para el problema que aquí se quiere
  resolver. Se está eligiendo la herramienta más agradable por encima de la más precisa para la
  regla que motivó la decisión.
- Reglas específicas de React o de React Native tienen menos cobertura que en ESLint.
- Si en el futuro hace falta una regla que Biome no tiene, la salida es añadir ESLint **encima** —
  y entonces se acaba con las dos herramientas que se quería evitar.

## Alternativas descartadas

- **ESLint + Prettier** — lo más capaz para esto, y por bastante: `eslint-plugin-boundaries` expresa
  las reglas de 0002 y 0008 con holgura y mensajes de error claros. Se descartó por el costo diario:
  dos herramientas, mucha más configuración y notablemente más lento en un repo donde el lint se
  corre a mano. **Es la salida si Biome no puede expresar la regla fina.**
- **oxlint + Prettier**, como el repo hermano `fulfillment-api` — coherencia con lo que ya está
  escrito allí, y muy rápido. Se descartó porque sigue siendo dos herramientas y porque su cobertura
  de reglas de imports habría que verificarla igual, sin ganar nada frente a Biome.
