# 0014 — Expo Router, Zustand y TanStack Query en el móvil

**Estado:** Aceptada · 2026-09-08

## Contexto

Tres cosas que suelen decidirse juntas y conviene nombrar por separado:

- **Navegación** — cómo se pasa de una pantalla a otra.
- **Estado** — dónde vive la información que varias pantallas comparten (el destino elegido, si hay
  una grabación en curso).
- **Datos del servidor** — quién llama al API, qué hace cuando falla y qué muestra mientras tanto.

La tercera es la que suele quedar sin dueño, y en esta app es la que más importa: se pedalea con
señal intermitente, así que las peticiones **van a fallar** de forma rutinaria y eso no puede
significar una pantalla en blanco.

## Decisión

- **Expo Router** para navegación — enrutado por archivos, como Next.js: la estructura de carpetas
  de `app/` es el mapa de pantallas. Es lo que Expo trae por defecto hoy.
- **Zustand** para el estado — un store minúsculo, sin proveedores ni reductores. Para el destino
  elegido y el estado de la grabación alcanza y sobra.
- **TanStack Query** para hablar con el API — reintentos, caché, y mostrar los datos anteriores
  mientras recarga en vez de vaciar la pantalla.

Los tres se reparten el trabajo sin pisarse: Zustand guarda lo que el usuario decidió, TanStack
Query guarda lo que el servidor contestó, y ninguno de los dos hace el trabajo del otro. Esa
separación es la mitad del valor.

TanStack Query envuelve al cliente RPC tipado de Hono ([0004](0004-hono-en-el-api.md)); no lo
reemplaza. El tipado extremo a extremo se mantiene.

## Consecuencias

**A favor**

- **Los fallos de señal dejan de ser un caso especial que hay que programar**: reintento y datos
  cacheados vienen dados. Es la razón principal de la decisión.
- Enrutado por archivos: no hay un registro de pantallas que mantener aparte.
- Zustand no re-renderiza de más — con un mapa en pantalla, eso se nota.

**En contra**

- **Son tres librerías que aprender** en vez de una, y la frontera "esto es estado de servidor,
  esto es estado local" hay que sostenerla con disciplina. Cuando se difumina, aparecen datos
  duplicados en los dos sitios y desincronizados.
- TanStack Query trae conceptos propios —claves de consulta, invalidación, datos rancios— que no
  se entienden el primer día.
- Expo Router está más verde que React Navigation, sobre el que está construido, y algunos casos
  raros obligan a bajar a la capa de abajo.

## Alternativas descartadas

- **Expo Router + Zustand, sin TanStack Query** — una pieza menos que aprender, llamando al API a
  mano con el cliente de Hono. Se descartó porque los reintentos, la caché y "qué muestro mientras
  no hay señal" no desaparecen: se terminan escribiendo igual, más tarde, peor y esparcidos por
  las pantallas.
- **React Navigation + Context de React** — sin dependencias de estado y con control total. Se
  descartó por el código repetido y porque Context re-renderiza todo lo que cuelga de él, que con
  un mapa en pantalla es justo lo que no se quiere.
- **Redux Toolkit** — mejor estructura impuesta y las mejores herramientas de depuración. Se
  descartó por desproporción para una app de cuatro pantallas.
