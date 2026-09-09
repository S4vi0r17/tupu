# 0027 — La brújula muestra hacia dónde miras, no dónde está el destino

**Estado:** Aceptada · 2026-09-08
**Reemplaza:** el punto 4 de [0010](0010-alcance-del-mvp.md), que describía la brújula como *"la
flecha que apunta al destino según hacia dónde mira el teléfono"*.

## Contexto

Tanto [0010](0010-alcance-del-mvp.md) como el README describían la brújula como una flecha
apuntando al destino. Al revisarlo quedó claro que eso es **otra funcionalidad**:

| | Lo que estaba escrito | Lo que se quiere |
|---|---|---|
| Qué muestra | Dónde está el destino | Hacia dónde estás mirando |
| Al girar el teléfono | La flecha se queda clavada en el destino | El indicador gira contigo |
| Para qué sirve | Orientarte sin mapa | Orientarte **dentro** del mapa |

Y hay un dato de uso que apareció después de escribir 0010: **el teléfono va en el portacelular
del manubrio**, con la pantalla encendida y el mapa a la vista. Eso descarta el caso de "sacar el
teléfono un segundo para ver una flecha": el mapa está delante todo el rato, y lo que falta es
saber cómo se orienta uno respecto de él.

## Decisión

Dos comportamientos:

1. **El marcador de posición lleva siempre un cono de visión** — el punto azul con el haz de luz,
   como el de Google Maps. Muestra hacia dónde apunta el teléfono, y por lo tanto el ciclista.
2. **Mientras se graba un recorrido, el mapa rota** para que arriba sea siempre hacia donde se
   mira. Así "la línea sigue hacia la derecha" significa literalmente "gira a la derecha". Un
   botón devuelve el norte arriba y sale del modo rotado.

Fuera de la grabación el mapa se queda con el norte arriba, que es lo cómodo para mirar el plano
de la ciudad.

## Consecuencias

**A favor**

- **Es más simple de lo que reemplaza.** No hay que calcular el rumbo hacia el destino ni restarlo
  del rumbo del teléfono: se pinta el rumbo directamente.
- Resuelve el momento real de duda —un cruce, con el mapa delante— sin navegación por voz, que
  está fuera del MVP.
- Rotar solo al grabar evita lo peor de las dos opciones: el mapa no se mueve cuando estás
  planificando, y no hay que traducir mentalmente cuando estás pedaleando.

**En contra**

- **El suavizado pasa de conveniente a crítico.** Un cono temblando ocupa píxeles en pantalla y se
  ve muchísimo más que una flecha pequeña. [0025](0025-brujula-heading-fusionado.md) sigue
  vigente y ahora es más importante afinar bien su parámetro.
- **La inclinación del portacelular es un caso obligatorio, no un extra.** El teléfono va a estar
  a unos 45°, y sin compensación de inclinación el rumbo miente. Es exactamente lo que
  [0025](0025-brujula-heading-fusionado.md) resuelve al usar el rumbo fusionado del sistema en vez
  del magnetómetro crudo — esa decisión se vuelve más necesaria, no menos.
- **Rotar el mapa cuesta batería** y hace rotar las etiquetas de texto, que MapLibre puede
  mantener horizontales pero hay que configurarlo.
- **La pantalla encendida en el manubrio consume mucho** con el GPS activo. Habrá que evitar que
  se apague (`expo-keep-awake`) y asumir el gasto, o dejarlo como opción.
- Deja sin uso, por ahora, el cálculo de "ángulo hacia el destino" que
  [0002](0002-layout-del-repo.md) daba como ejemplo de `packages/geo`. El resto de ese paquete
  —distancia, decodificar trazado, formatear km— sigue igual.

## Alternativas descartadas

- **Solo el cono, con el mapa siempre al norte** — más simple, menos redibujado, menos batería, y
  nunca desorienta. Se descartó porque en un cruce obliga a traducir mentalmente hacia dónde queda
  la línea, que es justo el segundo en que se necesita la ayuda.
- **El mapa rotando siempre** — lo más directo pedaleando. Se descartó porque vuelve incómodo
  mirar el plano de la ciudad al planificar, que es la otra mitad del uso de la app.
- **La flecha al destino**, como estaba escrito — sigue siendo útil, pero para otro caso: el
  teléfono guardado y sin mapa a la vista. No es el caso de uso real de este proyecto. Podría
  volver más adelante como complemento del cono, no como sustituto.
