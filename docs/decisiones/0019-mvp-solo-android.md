# 0019 — El MVP es solo Android

**Estado:** Aceptada · 2026-09-08

## Contexto

Expo compila para las dos plataformas ([0005](0005-expo-en-el-movil.md)), así que técnicamente
iOS está disponible. Lo que decide es otra cosa: **el desarrollo ocurre en Linux**.

| | Android | iOS |
|---|---|---|
| Compilar en la máquina propia | Sí, gratis e ilimitado | **Imposible**: hace falta un Mac |
| Instalar en un teléfono propio para probar | Copiar el APK | Requiere cuenta de desarrollador de Apple, **99 USD/año** |
| Probar en varias marcas | Repartir el APK | Cada dispositivo hay que registrarlo |

Y [0015](0015-grabacion-en-segundo-plano.md) pide exactamente lo que Android hace fácil y iOS caro:
**probar en teléfonos de varias marcas**, porque el problema conocido de la grabación en segundo
plano es que cada fabricante de Android mata las tareas a su manera.

## Decisión

**El MVP es solo Android.** Se compila en local con `expo run:android` y se reparte el APK.

iOS entra después del MVP, y no se cierra la puerta: el código es el mismo y Expo compila para
ambas. Lo que se aplaza es el gasto y la cadena de herramientas en la nube.

## Consecuencias

**A favor**

- Cero costo y cero cuotas: compilaciones ilimitadas desde la máquina propia.
- El ciclo de prueba es corto, que en algo que se prueba **pedaleando en la calle** importa más
  que en cualquier otra parte del proyecto.
- Se puede repartir el APK a conocidos con teléfonos de distintas marcas, que es justo lo que la
  grabación en segundo plano necesita para validarse.

**En contra**

- **Se descubre tarde lo que en iOS funciona distinto**, y hay dos cosas donde eso es probable:
  los permisos de ubicación "siempre" y el acceso al magnetómetro, que en iOS tienen reglas
  propias. Conviene leer la documentación de iOS mientras se escribe, aunque no se compile.
- Medio mercado fuera mientras dure el MVP.
- Cuando llegue iOS habrá que montar EAS y pagar la cuenta de Apple; el trabajo no desaparece, se
  pospone.

## Alternativas descartadas

- **Android e iOS desde el inicio** — el doble de alcance y detección temprana de las diferencias.
  Se descartó por costo directo y por el ciclo de prueba: cada prueba en iPhone pasaría por una
  compilación en la nube, lo contrario de lo que necesita algo que se valida saliendo en bici.
- **Construir para ambas pero compilar iOS solo al cerrar el MVP** — retrasa el gasto sin cerrar
  la puerta. En la práctica es lo mismo que se decidió, dicho con más ceremonia: el código de Expo
  ya es multiplataforma, así que "construir pensando en ambas" no es una decisión, es lo que pasa
  solo.
