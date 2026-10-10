# 0028 — El destino se elige tocando el mapa o pegando coordenadas

Aceptada · 2026-09-08

## Contexto

Nunca se había decidido cómo se elige el destino. Buscar por nombre necesita un geocodificador
(Nominatim, Photon), que ni Valhalla ni OpenFreeMap traen: otro servicio, público y saturable, o
propio y compitiendo por la RAM del VPS.

## Decisión

- Un toque largo en el mapa fija el punto.
- Un campo acepta coordenadas pegadas, como `-12.1211, -77.0301`: el formato que copia Google Maps.

El geocodificador queda aplazado hasta que pegar coordenadas moleste, o la use alguien más.

## Se paga

- Es incómodo: hay que salir a otra app para buscar el sitio.
- Tocar el mapa exige saber dónde queda.
- La entrada hay que validarla bien: un orden invertido manda la ruta al mar.
- Sin historial ni favoritos.

## Descartado

- **Solo tocar el mapa.** El campo de coordenadas cuesta casi nada.
- **Buscar por nombre de ciclovía.** Nadie quiere ir a una ciclovía, sino a un sitio.
- **Nominatim u otro geocodificador.** Aplazado: hospedado depende de terceros, propio es otro
  contenedor pesado.
