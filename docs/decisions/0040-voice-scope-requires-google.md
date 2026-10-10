# 0040 — El MVP suma voz, velocímetro y pantalla encendida, y requiere Google Play Services

Aceptada · 2026-10-10 · Reemplaza en parte a 0010

## Contexto

Lo que tiene que hacer la app, dicho por quien la usa:

1. Ver las ciclovías de Lima; más adelante, de Perú y del mundo.
2. Fijar inicio y fin, y obtener una ruta ciclista.
3. Si no hay ruta, grabar el recorrido y guardarlo.
4. Una voz que diga «gire a la derecha»: en zonas peligrosas no se puede mirar el teléfono.

La voz obliga a seguir la posición con el teléfono en el bolsillo y la pantalla apagada. En
Android hay dos fuentes:

- `expo-location`: funciona en segundo plano, pero solo con Google Play Services. Sin ellos no
  falla: calla.
- El `LocationManager` de MapLibre: GPS del sistema, cualquier Android, pero solo en primer plano.

## Decisión

El MVP son siete piezas:

| | Pieza | Estado al decidir |
|---|---|---|
| 1 | Ciclovías en el mapa | Hecho (0038) |
| 2 | Ruta en bici entre dos puntos | El API la calcula; falta la pantalla (0028) |
| 3 | Grabación del recorrido | Decidida (0013, 0015) |
| 4 | Brújula y cámara que sigue | Hecho (0027, 0039) |
| 5 | Voz en cada maniobra | Nueva |
| 6 | Velocímetro en km/h, suavizado | Nueva |
| 7 | Pantalla que no se apaga sola | Nueva |

La posición sale de `expo-location`, en primer y segundo plano. La app requiere Google Play
Services; los teléfonos sin ellos quedan fuera.

Valhalla ya da cada maniobra con su frase en español. Pedida con `language: es-ES` entre
Miraflores y San Isidro: «Gire a la izquierda hacia Ciclovía Avenida Larco». Hoy el API las
descarta. `expo-speech` las lee con el sintetizador de Android, sin señal. Lo difícil es detectar
que el ciclista se salió de la ruta y recalcularla.

`expo-keep-awake` evita que la pantalla se apague sola en el portacelular. Para el bolsillo se
apaga con el botón, y la posición sigue llegando.

La cámara se queda con los tres modos de 0039.

## Se paga

- Un teléfono sin Google Play Services queda fuera, y la app no puede detectarlo:
  `hasServicesEnabledAsync()` dice que todo está bien.
- Salirse de la ruta y recalcular es trabajo nuevo y lo más frágil de la voz.
- Sin verificar: que `expo-speech` hable con la pantalla apagada. Se prueba en la primera salida
  con ruta.
- Más batería.
- El mundo entero no entra con el mecanismo actual de la red ciclista.

## Descartado

- **`LocationManager` de MapLibre con la pantalla siempre encendida.** Cualquier Android, pero la
  pantalla prendida en el bolsillo: batería y toques accidentales.
- **Un módulo nativo propio con el GPS de Android en segundo plano.** Cualquier Android y pantalla
  apagada, a costa de mantener Kotlin.
- **Las dos fuentes en la misma app.** Errores que dependen de cuál contestó primero.
- **Dejar la voz para después.** Es lo que hace usable la ruta donde más importa.
