# Glosario

«Tiles» nombra dos cosas sin relación: los del mapa y los de ruteo. En `docs/` siempre se dice cuál.

## Datos

**OpenStreetMap (OSM).** Mapa mundial libre que edita cualquiera. De ahí salen las ciclovías.

**Overpass.** Servidores públicos para consultar OSM en vivo. Gratis, pero saturados (0012).

**Extracto (`.pbf`).** OSM de una región en un archivo comprimido. Geofabrik publica el de Perú a
diario.

**Ingesta.** Bajar el extracto, filtrar las ciclovías y cargarlas en PostGIS.

## Mapa

**Tiles del mapa.** El mapa cortado en cuadrados que el teléfono baja según lo que ve. Los
vectoriales traen datos en vez de imágenes, y por eso se puede elegir cómo pintar cada cosa.

**OpenFreeMap.** Quien sirve los tiles del mapa (0016).

**MapLibre.** La librería que dibuja el mapa en la app.

## Ruteo

**Valhalla.** El motor que calcula la ruta en bici y cuánto se tarda (0006).

**Grafo de ruteo.** Las calles convertidas en algo navegable: qué conecta con qué, en qué sentido,
con qué pendiente. El extracto trae líneas con etiquetas; el grafo hay que construirlo.

**Tiles de ruteo.** El grafo cortado por zonas. No son imágenes. Para Perú ocupan unos 425 MB,
más que el extracto: el `.pbf` viene comprimido y el grafo no.

**Costeo.** Las preferencias de la ruta: cuánto evita avenidas o subidas. En Valhalla viajan en
cada petición, así que se cambian sin reconstruir el grafo.

**Maniobra.** Cada giro de una ruta, con su frase para leer en voz alta.

**Isócrona.** La zona alcanzable en cierto tiempo.

**Map matching.** Pegar los puntos del GPS a las calles reales.

## Base de datos

**PostGIS.** Extensión de PostgreSQL que agrega tipos y funciones geográficas (0011).

**Funciones `ST_`.** Las funciones de PostGIS: `ST_Length` da los metros de una línea.

**Índice GiST.** Índice espacial: la base mira solo las zonas relevantes.

**Drizzle.** La capa entre el código y la base (0007).

**Migración.** Un cambio de estructura de la base, guardado como archivo para aplicarlo en orden.

## Despliegue

**VPS.** Un servidor alquilado.

**Dokploy.** El panel que despliega los contenedores en el VPS (0009).

**Docker.** Cada pieza empaquetada con lo que necesita, para que corra igual en todas partes.

**Staging.** Una copia del sistema para ensayar. No hay (0018).

## Móvil

**Expo.** Herramientas para hacer la app con React Native.

**EAS.** El servicio de compilación de Expo. Hará falta para firmar y para iOS (0019).

**APK.** El instalable de Android.

**Magnetómetro.** El sensor de la brújula. Es ruidoso y hay que suavizarlo.

**Segundo plano.** Código que sigue corriendo con la pantalla apagada. Así se graba el recorrido
y así habla la voz (0015, 0040).
