# 0015 — Grabación en segundo plano con `expo-location`

**Estado:** Aceptada · 2026-09-08

## Contexto

Nadie pedalea mirando el teléfono. Para que el historial de recorridos sirva, la app tiene que
seguir tomando posiciones **con la app minimizada y la pantalla apagada**, durante una hora o más.

Es el punto más frágil de todo el proyecto, y conviene decirlo sin adornos: **no hay solución que
funcione siempre**. Android mata procesos en segundo plano para ahorrar batería, y cada fabricante
lo hace a su manera — Xiaomi, Oppo y Samsung tienen capas propias de "optimización" que
matan tareas que el Android puro respeta. iOS es más predecible pero también más estricto con los
permisos.

## Decisión

**`expo-location` con una tarea de fondo** (`startLocationUpdatesAsync` más `expo-task-manager`),
con notificación persistente en Android.

Los puntos se insertan en SQLite a medida que llegan ([0013](0013-recorrido-en-sqlite-local.md)),
así que si el sistema mata el proceso a mitad de camino se pierden segundos, no el recorrido. Esa
combinación es la que hace aceptable el riesgo: no se evita que Android mate la tarea, se hace que
importe poco.

Son piezas oficiales de Expo, gratuitas y sin configuración nativa propia
([0005](0005-expo-en-el-movil.md)).

## Consecuencias

**A favor**

- Sin costo y sin dependencias nuevas fuera del ecosistema que ya se eligió.
- La notificación persistente de Android, además de ser obligatoria, es honesta: el usuario ve que
  se está grabando.
- Combinado con la escritura punto a punto, el peor caso es un recorrido cortado, no perdido.

**En contra**

- **Va a fallar en algunos teléfonos y no vamos a poder arreglarlo.** En ciertos Android el sistema
  mata la tarea aunque todo esté bien hecho. Hay que asumirlo: detectar el corte, avisar al
  usuario, y quizá pedirle que excluya la app de la optimización de batería.
- **Los permisos son dos pasos, no uno.** El permiso de ubicación "siempre" se pide aparte del de
  "mientras usas la app", y en iOS el sistema puede volver a preguntar más adelante. La pantalla
  que lo explique hay que escribirla bien o la gente lo deniega.
- **La batería es un problema real** grabando una hora. Habrá que ajustar cada cuánto se pide
  posición y con qué precisión, y eso solo se afina probando en la calle.
- Probar esto es incómodo: hay que salir en bici de verdad, con teléfonos de distintas marcas.

## Alternativas descartadas

- **`react-native-background-geolocation`** (transistorsoft) — la librería de referencia para
  exactamente este problema: resuelve las manías de cada fabricante, detecta movimiento para no
  gastar batería parado, y lleva años puliéndose. Se descartó por costo: su licencia para Android
  es de pago, y esto es un proyecto personal. **Queda como la salida** si `expo-location` resulta
  demasiado poco fiable en la calle — cambiar es reescribir la capa de grabación, no la app.
- **Grabar solo con la app abierta y la pantalla encendida** — cero complejidad, y suficiente para
  probar el resto del MVP. Se descartó porque deja fuera el caso real de uso: sería un botón que
  obliga a pedalear con el teléfono en la mano y sin bloquear.
