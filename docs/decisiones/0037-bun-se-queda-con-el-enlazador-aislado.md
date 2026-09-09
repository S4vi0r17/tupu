# 0037 — Bun se queda con el enlazador aislado

**Estado:** Aceptada · 2026-09-09 · **sustituye** a [0035](0035-bun-instala-con-enlazador-plano.md)

## Contexto

[0035](0035-bun-instala-con-enlazador-plano.md) forzó `linker = "hoisted"` porque Metro no lograba
resolver `@expo/metro-runtime`, una dependencia interna de `expo-router`, y al declararla apareció
otra detrás.

**El diagnóstico estaba mal.** La causa no era el enlazador de Bun, era una línea de
`metro.config.js` escrita al armar el esqueleto:

```js
config.resolver.disableHierarchicalLookup = true
```

Esa opción apaga la resolución subiendo desde el archivo que importa. Con `node_modules` plano da
igual, porque todo está arriba. Con un store aislado es lo único que funciona: cada paquete guarda
sus dependencias en su propio `node_modules`, y se llega a ellas subiendo desde quien las pide.
Se puso pensando que endurecía la regla de dependencia; lo que hacía era romper la resolución.

## Decisión

**Enlazador aislado**, que es el valor por defecto de Bun 1.4, escrito explícitamente porque este
repo ya se rompió una vez por dar un defecto por supuesto:

```toml
# bunfig.toml
[install]
linker = "isolated"
```

Y `disableHierarchicalLookup` **no se pone**, con un comentario en `metro.config.js` que dice por
qué, porque es una línea que cualquier guía de monorepos con Expo recomienda.

## Consecuencias

**A favor**

- **El aislamiento es real y está comprobado.** Se intentó importar `postgres` —dependencia del
  API— desde `apps/mobile`, y el bundle falla con *Unable to resolve module postgres*. Eso es
  exactamente lo que [0001](0001-monorepo-con-bun.md) llamaba «el riesgo más real de esta
  decisión» y daba por imposible de evitar con Bun.
- **La regla de Biome pasa a ser la segunda línea de defensa, no la única.** Sigue haciendo falta,
  porque da un mensaje que explica la regla en vez de un error de resolución, y porque cubre los
  imports por ruta relativa que el enlazador no puede ver.
- Se cayó la dependencia declarada solo para engañar al bundler: `@expo/metro-runtime` se quitó y
  el bundle sigue construyéndose, con 1910 módulos.
- Un `node_modules` más chico y sin dos versiones de un paquete peleándose por el mismo lugar.

**En contra**

- **La ventaja de Bun frente a pnpm que decía [0001](0001-monorepo-con-bun.md) ya no existe**, y
  esto no lo arregla 0037. Los dos instalan aislado. Lo que queda a favor de Bun es ser un solo
  binario para instalar, ejecutar y testear, que sigue siendo cierto y sigue alcanzando.
- Cualquier paquete que resuelva dependencias a mano, sin pasar por Node, puede romperse. Es el
  costo conocido del modelo de pnpm, y ahora lo tiene este repo.
- La guía de monorepos de Expo recomienda esa línea de Metro. Hay que resistirla cada vez que
  alguien la copie de un README, y de ahí el comentario.

## Alternativas descartadas

- **Quedarse en plano, como decía 0035** — funciona, y era lo que estaba andando. Se descartó
  porque se apoyaba en un diagnóstico equivocado y porque paga un precio real, perder el
  aislamiento, sin comprar nada a cambio ahora que se sabe cuál era el problema.
- **Aislado pero dejando `@expo/metro-runtime` declarado** por si acaso — se descartó por probarlo:
  sin esa dependencia el bundle se construye igual, así que era ruido.

## La lección, que vale más que la decisión

El primer intento se declaró fallido después de dos errores de resolución seguidos. Los dos venían
de la misma línea propia, no de la herramienta. **Antes de cambiar el enlazador, o cualquier cosa
que esté debajo de todo, hay que descartar la configuración propia que toca ese mismo mecanismo.**
