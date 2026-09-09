-- La columna geom de cycleways no se puede crear sin la extensión, así que
-- va primero y dentro de la misma cadena de migraciones que corre al arrancar.
CREATE EXTENSION IF NOT EXISTS postgis;
