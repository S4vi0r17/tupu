-- ogr2ogr vuelca las etiquetas de OSM que no son columna en other_tags, con
-- formato hstore. Sin la extensión hay que parsearlas a mano con expresiones
-- regulares; con ella es other_tags->'surface'.
CREATE EXTENSION IF NOT EXISTS hstore;
