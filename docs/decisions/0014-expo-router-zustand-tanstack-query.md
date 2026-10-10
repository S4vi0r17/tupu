# 0014 — Expo Router, Zustand y TanStack Query en el móvil

Aceptada · 2026-09-08

## Contexto

Tres cosas distintas: navegar entre pantallas, compartir estado entre ellas (el destino, si se está
grabando) y hablar con el API. La tercera es la que suele quedar sin dueño, y pedaleando la señal
se corta: las peticiones van a fallar seguido.

## Decisión

- Expo Router: las pantallas son archivos en `app/`.
- Zustand: estado compartido sin proveedores ni reductores.
- TanStack Query: reintentos, caché y datos anteriores mientras recarga. Envuelve al cliente de
  Hono (0004).

Zustand guarda lo que decidió el usuario; TanStack Query, lo que contestó el servidor.

## Se paga

- Tres librerías que aprender, y la frontera entre estado local y del servidor hay que sostenerla.
- TanStack Query trae sus conceptos: claves, invalidación, datos rancios.
- Expo Router está más verde que React Navigation.

## Descartado

- **Sin TanStack Query.** Los reintentos y la caché se terminan escribiendo igual, peor y
  esparcidos.
- **React Navigation y Context.** Context re-renderiza todo lo que cuelga de él, con un mapa en
  pantalla.
- **Redux Toolkit.** Desproporcionado para cuatro pantallas.
