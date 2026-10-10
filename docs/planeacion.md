# Planeación

Estado del proyecto y lo que queda. Las decisiones están en [`decisiones/`](decisiones/).

Actualizado el 2026-10-10.

## Estado del MVP

| Pieza | Estado |
|---|---|
| Ciclovías en el mapa | Hecho. La red entera en una petición (0041) |
| Ruta en bici entre dos puntos | El API la calcula en producción. Falta la pantalla: tocar inicio y fin (0028) y dibujar el trazado |
| Voz en cada giro | Por hacer. Valhalla ya da las frases en español; falta que el API las devuelva (0040) |
| Grabación del recorrido | Por hacer (0013, 0015) |
| Brújula y cámara que te sigue | Hecho y probado en la calle el 2026-09-10 (0025, 0039) |
| Velocímetro | Por hacer (0040) |
| Pantalla que no se apaga sola | Por hacer (0040) |
| Servidor | Desplegado en Dokploy ([infra](../infra/README.md)) |

## Pendientes sin decisión

- Licencia del repositorio.
- Icono de la app. El nombre y el `package id` ya están (`pe.tupu.app`).
- Que la app muestre el 503 de Valhalla caído. El API ya lo devuelve como `upstream_unavailable`.
- Etiquetas del mapa horizontales cuando el mapa gira (0039).
- La pantalla que explica el permiso de ubicación «siempre». Mal escrita, la gente lo niega (0015).
- Detectar que el ciclista se salió de la ruta y recalcularla (0040).

## Aplazado, con disparador

| Qué | Cuándo | |
|---|---|---|
| Límite de uso en el API | **Antes de pasarle el APK a otra persona** | 0030 |
| Backups de la base | **Antes de la primera cuenta de usuario** | 0017 |
| EAS Build y keystore propio | El primer APK para otra persona, o iOS | 0005, 0019 |
| Tests | El primer error de cálculo que llegue a la calle | 0024 |
| CI | Cuando haya tests, o un despliegue roto cueste una tarde | 0023 |
| Tiles del mapa propios | Cuando llegue el uso sin señal | 0016 |
| Cron para `osm:update` | Cuando correrlo a mano moleste | 0012, 0020 |
| Entorno de pruebas | Cuando haya gente usando la app | 0018 |
| iOS | Después del MVP | 0019 |
| `react-native-background-geolocation` | Si `expo-location` falla en la calle | 0015 |
| Buscar destino por nombre | Cuando pegar coordenadas moleste | 0028 |
| Afinar el perfil ciclista | Desde la primera salida en bici | 0029 |
| Exponer el perfil al usuario | Cuando se sepa qué valores son buenos | 0029 |
| Turborepo | Cuando los tests dejen de correr en segundos | 0001 |

El keystore va junto al límite de uso: un APK firmado con otra clave no se instala encima del
anterior, y desinstalar borra los recorridos guardados en el teléfono.

## Fuera del MVP

- Cuentas y sincronización de recorridos. Empezar con un token opaco en base no cierra puertas.
- Rutas alternativas. Valhalla ya las da.
- Uso sin señal.
- Caché del motor de ruteo.
- Ruteo en el teléfono, sin servidor. `valhalla-mobile` lo permite; falta un módulo de Expo.
- Distribución más allá de pasar el APK a mano.
