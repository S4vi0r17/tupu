# 0034 — El proyecto se llama `tupu`

**Estado:** Aceptada · 2026-09-09 · **sustituye** al nombre `rumbo`

## Contexto

El nombre `rumbo` venía de la primera sesión de planeación y nunca tuvo documento propio: figuraba
como una fila sin enlace en [`planeacion.md`](../planeacion.md). Al ir a crear el repositorio
apareció el momento correcto para revisarlo, porque el nombre se escribe en sitios de los que
después no sale gratis.

Dos problemas concretos, y ninguno es de gusto:

1. **La palabra ya está ocupada dentro del propio repo.** «Rumbo» es vocabulario técnico de este
   proyecto: en [0025](0025-brujula-heading-fusionado.md) y [0027](0027-brujula-muestra-hacia-donde-miras.md)
   significa *heading*, el ángulo hacia donde apunta el teléfono. De las 39 apariciones que había en
   `docs/`, 12 eran esa acepción. Un nombre de producto que colisiona con un término del dominio
   obliga a desambiguar en cada frase.
2. **Hacia afuera compite con Rumbo**, la agencia de viajes, que es el primer resultado de
   búsqueda.

## Decisión

El proyecto se llama **`tupu`**, en minúscula.

El *tupu* era la unidad de medida inca aplicada sobre todo a **medir caminos**, lo que los
cronistas españoles llamaron la legua andina. Su particularidad es la razón por la que se eligió:
**no era una distancia fija**. La legua andina cambiaba de largo según el terreno fuera llano o
quebrado, porque incorporaba el esfuerzo dentro de la medida.

Eso es exactamente el criterio de [0029](0029-perfil-ciclista-de-valhalla.md): el perfil ciclista
no optimiza kilómetros, optimiza cuestas evitadas. El nombre no describe una bicicleta ni un mapa,
describe **cómo mide el sistema**.

Se escribe en todas partes así:

```
tupu/
@tupu/api   @tupu/mobile   @tupu/contracts   @tupu/geo
pe.tupu.app                                   ← package id de Android
```

## Consecuencias

**A favor**

- **Libera la palabra «rumbo»** para lo único que significa acá, que es *heading*. Las decisiones
  de la brújula dejan de ser ambiguas sin tocarles una línea.
- Cuatro letras, dos sílabas, sin tilde y sin eñe: entra igual en un identificador, en un dominio y
  en el `package id` de Android, sin transliterar nada.
- El significado hace un trabajo en vez de decorar, que era el filtro con el que se descartó el
  resto.

**En contra**

- **Hay que explicarlo.** Nadie fuera de Perú sabe qué es un tupu, y bastante gente dentro tampoco.
  Es el precio de un nombre opaco, y se paga cada vez que se presenta el proyecto.
- Existen dos empresas berlinesas llamadas `tupu`, una de hongos gourmet y otra de mentoría.
  Ninguna en Perú, ninguna en el rubro, ninguna en Play Store en español. Si el proyecto llegara a
  registrar marca, esto habría que mirarlo de nuevo.
- El renombre tocó 12 archivos de `docs/`. Salió barato **porque se hizo antes de escribir código**;
  un mes después habría incluido el `package id`, y ahí ya no es un `sed`.

## Alternativas descartadas

- **Mantener `rumbo`** — cero trabajo. Se descartó por los dos problemas del contexto, sobre todo
  por el choque con el vocabulario del dominio, que es un roce permanente y hacia adentro.
- **`ñan`**, camino en quechua, el del Qhapaq Ñan — el mínimo absoluto, tres letras. Se descartó por
  un costo técnico permanente: la eñe no entra en identificadores, dominios ni en el `package id`,
  así que en todos esos lugares se escribiría `nan`, que en TypeScript se lee como *Not a Number*.
- **`puriq`**, el que anda, el que viaja — sin colisiones y visualmente distintivo. Se descartó
  porque conviven `puriy`, `purik` y `puriq`, y un nombre que se escribe de tres formas se escribe
  mal.
- **`wayra`**, viento — descartado por Wayra, la aceleradora de Telefónica, muy presente en Lima.
- **`berma`** y **`muyu`** — libres en Perú, pero la primera evoca la orilla a la que te arrinconan
  y la segunda comparte nombre con varias apps de meditación en Play Store.
