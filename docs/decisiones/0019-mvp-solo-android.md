# 0019 — El MVP es solo Android

Aceptada · 2026-09-08

## Contexto

Expo compila para las dos plataformas (0005), pero se desarrolla en Linux:

| | Android | iOS |
|---|---|---|
| Compilar en la máquina propia | Sí | No: hace falta un Mac |
| Probar en un teléfono | Copiar el APK | Cuenta de Apple, 99 USD al año |
| Probar en varias marcas | Repartir el APK | Registrar cada dispositivo |

Y la grabación en segundo plano hay que probarla en varias marcas (0015).

## Decisión

Solo Android en el MVP. Se compila en local y se reparte el APK. iOS después: el código es el
mismo.

## Se paga

- Las diferencias de iOS se descubren tarde: permiso «siempre» y magnetómetro tienen reglas
  propias.
- Medio mercado fuera.
- iOS traerá EAS y la cuenta de Apple.

## Descartado

- **Android e iOS desde el inicio.** Cada prueba en iPhone pasaría por una compilación en la nube.
