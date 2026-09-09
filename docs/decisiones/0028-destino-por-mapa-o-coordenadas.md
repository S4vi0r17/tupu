# 0028 — El destino se elige tocando el mapa o pegando coordenadas

**Estado:** Aceptada · 2026-09-08

## Contexto

Toda la planeación daba por hecho "el destino elegido" —[0014](0014-expo-router-zustand-tanstack-query.md)
lo nombra como estado compartido— pero **nunca se decidió cómo se elige**. Era un hueco real, y
apareció al describir qué hace la app de punta a punta.

Buscar por nombre —escribir *"Parque Kennedy"* y que aparezca— necesita un **geocodificador**, que
es una pieza que ninguna de las decisiones tomadas cubre: ni Valhalla ni OpenFreeMap lo hacen.
Sería Nominatim (el de OSM, con límites de uso parecidos a los de Overpass), Photon, o
auto-hospedarlo — o sea, otro contenedor en el VPS que ya comparte RAM con Valhalla
([0006](0006-valhalla-para-ruteo.md)).

## Decisión

**Dos formas, ambas sin pieza nueva:**

1. **Tocar el mapa.** Un toque largo fija el destino donde se tocó.
2. **Pegar coordenadas.** Un campo que acepta `-12.1211, -77.0301` — el formato que Google Maps
   copia al portapapeles.

La segunda es la que hace usable a la primera: para ir a un sitio concreto se busca en Google
Maps, se copian las coordenadas y se pegan en tupu. Es fricción, pero es fricción de treinta
segundos y cuesta parsear una cadena de texto.

**El geocodificador queda aplazado**, con disparador: cuando pegar coordenadas moleste lo
suficiente, o cuando la app la use alguien que no sea quien la escribió.

## Consecuencias

**A favor**

- **Cero infraestructura nueva.** No hay servicio que montar, ni clave, ni cuota, ni dependencia
  de servidores públicos saturables — que es el problema del que este proyecto viene huyendo
  ([0012](0012-ingesta-de-osm-por-extracto.md)).
- Pegar coordenadas es **más preciso** que buscar por nombre: apunta al portón exacto, no al
  centroide de un parque.
- El campo de coordenadas sirve igual el día que haya buscador: se convierte en un campo que
  acepta las dos cosas.

**En contra**

- **Es incómodo y se nota**, sobre todo la primera vez que alguien ajeno abre la app. Salir a otra
  aplicación para poder usar ésta es exactamente el tipo de cosa que hace abandonar.
- **Tocar el mapa exige saber dónde queda el sitio**, arrastrando y haciendo zoom.
- Hay que validar la entrada con cuidado: separadores raros, orden invertido, coordenadas fuera de
  Lima. Un `-77, -12` mal puesto manda la ruta al Atlántico.
- No hay historial de destinos ni favoritos, que es lo primero que se va a echar de menos.

## Alternativas descartadas

- **Solo tocar el mapa**, sin coordenadas — lo mínimo. Se descartó porque el campo de coordenadas
  cuesta casi nada y elimina la mayor parte de la fricción.
- **Buscar entre las ciclovías de PostGIS por `name`** — sin pieza nueva, aprovechando los datos
  que ya están ([0011](0011-postgis-desde-el-inicio.md)). Se descartó porque encuentra ciclovías,
  no destinos: nadie quiere ir *a* una ciclovía, quiere ir a un sitio.
- **Nominatim u otro geocodificador** — la solución de verdad. Aplazada, no descartada: usarlo
  hospedado repite el problema de depender de servidores públicos, y auto-hospedarlo es otro
  contenedor pesado antes de haber visto la primera ruta en pantalla.
