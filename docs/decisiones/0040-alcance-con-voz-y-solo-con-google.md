# 0040 — El MVP suma voz, velocímetro y pantalla encendida, y requiere Google Play Services

**Estado:** Aceptada · 2026-10-10
**Reemplaza:** parcialmente a [0010](0010-alcance-del-mvp.md), que dejaba la navegación por voz
fuera del MVP. Las cuatro piezas de 0010 siguen; esta decisión agrega tres.

## Contexto

Dicho como quien va a usar la app, lo que tiene que hacer es esto:

1. **Ver las ciclovías** de Lima; más adelante, de Perú y del mundo.
2. **Fijar un inicio y un fin y obtener una ruta ciclista.**
3. Si no hay ruta, o no hace falta, **grabar el recorrido** y guardarlo.
4. **Que una voz diga** «gire a la derecha», «continúe de frente»: en los lugares peligrosos no se
   puede ir mirando el teléfono.

Las tres primeras ya estaban en [0010](0010-alcance-del-mvp.md). La cuarta estaba fuera del MVP,
como «navegación por voz paso a paso, aplazada».

La voz cambia una cosa de fondo. Si el teléfono va en el bolsillo, la app tiene que seguir la
posición **con la pantalla apagada**, y en Android hay dos fuentes de posición posibles:

- **`expo-location`**, la que usa `tupu`: funciona en segundo plano, pero pide la posición solo a
  Google Play Services. En un teléfono sin ellos no falla: calla.
- **El `LocationManager` de MapLibre**: usa el GPS del sistema y anda en cualquier Android, pero
  **solo con la app en pantalla**.

## Decisión

**El MVP son siete piezas:**

| | Pieza | Estado |
|---|---|---|
| 1 | Mapa con las ciclovías | Hecho ([0038](0038-ciclovias-dibujadas-desde-el-api.md)) |
| 2 | Ruta ciclista entre dos puntos | El API la calcula; falta la pantalla ([0028](0028-destino-por-mapa-o-coordenadas.md)) |
| 3 | Grabación del recorrido, guardada en el teléfono | Decidida en [0013](0013-recorrido-en-sqlite-local.md) y [0015](0015-grabacion-en-segundo-plano.md) |
| 4 | Brújula con cono y cámara que te sigue | Hecho ([0027](0027-brujula-muestra-hacia-donde-miras.md), [0039](0039-tres-modos-de-camara.md)) |
| 5 | **Voz** que anuncia cada maniobra de la ruta | Nueva |
| 6 | **Velocímetro** en km/h, suavizado | Nueva |
| 7 | **Pantalla que no se apaga sola** mientras la app está abierta | Nueva |

**La posición sale de `expo-location`, en primer y en segundo plano, y `tupu` requiere un Android
con Google Play Services.** Los teléfonos sin ellos quedan fuera, sin app aparte ni plan para
cubrirlos.

### La voz

Valhalla ya devuelve cada maniobra con su frase hablada en español. Pedida con `language: es-ES`
entre Miraflores y San Isidro, responde *«Gire a la izquierda hacia Ciclovía Avenida Larco»* y
*«Continúe en Ciclovía Arequipa»*. No hay que redactar instrucciones: hay que **dejar de
descartarlas**, porque hoy el API devuelve solo el trazado.

Del lado del teléfono, `expo-speech` las lee con el sintetizador de voz de Android, que no
necesita señal. Lo difícil es otra cosa: **saber cuándo te saliste de la ruta** y pedir una nueva.

### La pantalla y el bolsillo

Las dos cosas conviven. `expo-keep-awake` impide que la pantalla se apague **sola** mientras la app
está abierta, que es lo que hace falta con el teléfono en el portacelular. Para ir con el teléfono
en el bolsillo se apaga con el botón, y la posición sigue llegando por el segundo plano.

### La cámara se queda con tres modos

El velocímetro y la pantalla encendida venían de una app anterior que tenía **dos** modos de
cámara. Acá se quedan los tres de [0039](0039-tres-modos-de-camara.md), que incluyen esos dos: el
intermedio es el que evita que el mapa entero tiemble parado en un semáforo.

## Consecuencias

**A favor**

- **Una sola fuente de posición**, la misma para el punto azul, la voz y la grabación. No hay dos
  caminos de permisos ni un punto que salte según cuál contestó primero.
- **Lo que ya estaba decidido no se mueve**: [0015](0015-grabacion-en-segundo-plano.md) ya elegía
  `expo-location` en segundo plano para grabar.
- **La voz cuesta menos de lo que parecía**: las frases las pone Valhalla, en español.

**En contra**

- **Cualquier teléfono sin Google Play Services queda fuera**, y la app no puede ni avisarlo:
  `hasServicesEnabledAsync()` consulta el proveedor del sistema y dice que todo está bien.
- **Detectar que te saliste de la ruta y recalcular** es trabajo nuevo, y es la parte de la voz que
  más puede fallar en la calle.
- **Que la voz siga hablando con la pantalla apagada está sin verificar.** La posición en segundo
  plano está probada como mecanismo; que `expo-speech` hable desde ahí, no. Se comprueba en la
  primera salida con ruta.
- **Más batería**: GPS en segundo plano y, en el portacelular, pantalla encendida.
- **Mostrar la red del mundo** no entra con el mecanismo actual. Lima y Perú, sí.

## Alternativas descartadas

- **El `LocationManager` de MapLibre con la pantalla siempre encendida.** Anda en cualquier
  Android y no necesita segundo plano. Se descartó porque obliga a llevar la pantalla prendida en
  el bolsillo: batería, toques accidentales, y la grabación se corta si la app pasa a segundo
  plano.
- **Un módulo nativo propio con el GPS de Android en segundo plano.** Anda en cualquier Android y
  con la pantalla apagada. Se descartó por el costo: escribir y mantener código Kotlin para cubrir
  teléfonos que no son el objetivo.
- **Las dos fuentes en la misma app**, MapLibre en primer plano y `expo-location` en segundo. Se
  descartó porque produce errores que no se pueden reproducir, según cuál de las dos contestó
  primero.
- **Dejar la voz para después**, como decía [0010](0010-alcance-del-mvp.md). Se descartó porque es
  lo que hace usable la ruta en los lugares donde más importa: los que no permiten mirar el
  teléfono.
