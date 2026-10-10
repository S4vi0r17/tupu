# 0037 — Bun se queda con el enlazador aislado

Aceptada · 2026-09-09 · Sustituye a 0035

## Contexto

0035 forzó el enlazador plano porque Metro no resolvía dependencias internas de `expo-router`. La
causa real era una línea propia de `metro.config.js`:

```js
config.resolver.disableHierarchicalLookup = true
```

Apaga la resolución subiendo desde quien importa, que con un store aislado es la única que
funciona.

## Decisión

Enlazador aislado, escrito explícitamente en `bunfig.toml`:

```toml
[install]
linker = "isolated"
```

`disableHierarchicalLookup` no se pone, con un comentario en `metro.config.js`: las guías de
monorepos con Expo la recomiendan.

Comprobado: importar `postgres` desde `apps/mobile` hace fallar el bundle. Biome queda como segunda
defensa, con un mensaje claro y cubriendo rutas relativas.

## Se paga

- Ya no hay ventaja de Bun sobre pnpm en el enlazador: queda la de ser un solo binario.
- Un paquete que resuelva dependencias a mano, sin Node, puede romperse.
- Hay que resistir esa línea de Metro cada vez que alguien la copie.

## Descartado

- **Seguir en plano.** Se apoyaba en un diagnóstico equivocado y perdía el aislamiento.
- **Dejar `@expo/metro-runtime` declarado.** Sin él el bundle se construye igual.

Antes de cambiar algo que está debajo de todo, descartar la configuración propia que toca el mismo
mecanismo.
