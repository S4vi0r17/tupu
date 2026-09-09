# 0035 — Bun instala con enlazador plano

**Estado:** Aceptada · 2026-09-09 · **sustituye en parte** a [0001](0001-monorepo-con-bun.md)

## Contexto

[0001](0001-monorepo-con-bun.md) eligió Bun sobre pnpm con este argumento, textual:

> Bun instala `node_modules` **aplanado**, que es lo que Metro —el bundler de React Native— espera.
> Con pnpm hay que forzar `node-linker=hoisted` para que Expo no se rompa.

**Eso ya no es cierto.** Bun 1.4 instala **aislado** por defecto: un store en `node_modules/.bun/`
y enlaces simbólicos, que es exactamente el modelo de pnpm. En la raíz solo aparecen las
dependencias declaradas, y en cada workspace solo las suyas.

Se descubrió al construir el bundle del móvil. Metro no pudo resolver `@expo/metro-runtime`, que
`expo-router` usa por dentro y nadie declara. Al declararlo, faltó `whatwg-fetch`, transitiva de
esa transitiva. El ecosistema de React Native asume `node_modules` plano y da por sentado que
puede alcanzar cualquier transitiva.

## Decisión

Fijar el enlazador plano en la raíz, explícitamente:

```toml
# bunfig.toml
[install]
linker = "hoisted"
```

Lo que 0001 daba por comportamiento por defecto pasa a ser configuración escrita. La conclusión de
0001 sobrevive; su premisa no.

## Consecuencias

**A favor**

- Metro resuelve como espera y el bundle se construye. Verificado: 1884 módulos empaquetados.
- **El argumento con el que se descartó pnpm queda dado vuelta y hay que decirlo.** Se rechazó
  pnpm porque obligaba a `node-linker=hoisted`; ahora Bun necesita lo mismo. La ventaja que
  quedaba de Bun es ser un solo binario para instalar, ejecutar y testear, no el enlazador.
- Al ser explícito, un cambio futuro del defecto de Bun no rompe el repo en silencio.

**En contra**

- **Se pierde el aislamiento real.** Con el store aislado, el móvil no podía ni ver el cliente de
  Postgres; ahora puede. Vuelve a valer al pie de la letra la advertencia de 0001: la regla de
  Biome es **lo único** que lo impide. Se comprobó que las reglas siguen disparando después del
  cambio, rompiéndolas a propósito.
- Se está eligiendo la comodidad de Metro por encima de una garantía estructural que estuvo
  disponible por defecto durante unas horas.
- Un `node_modules` plano es más grande y con más superficie de conflicto entre versiones.

## Alternativas descartadas

- **Quedarse en aislado y declarar cada transitiva que Metro pida** — es lo más correcto en
  teoría y lo probé primero. Se descartó porque no escala: al resolver `@expo/metro-runtime`
  apareció `whatwg-fetch`, y detrás vendrían las suyas. Declarar dependencias que no se importan,
  solo para que el bundler las alcance, es ruido que además hay que mantener.
- **Aislado con parches en la resolución de Metro** — se descartó por dónde caería el costo:
  [0002](0002-layout-del-repo.md) ya avisa de que cuando algo falla en la configuración de Metro
  los mensajes de error son pésimos. No es el sitio donde conviene ser original.
- **Migrar a pnpm ahora que la diferencia se borró** — no se hace, pero por primera vez no es una
  decisión obvia. Se aplaza sin disparador: no hay problema que resolver mientras Bun funcione.
