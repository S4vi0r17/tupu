# 0010 — Alcance del MVP

**Estado:** Aceptada · 2026-09-08
**Reemplaza:** la línea de alcance de [`../planeacion.md`](../planeacion.md) que decía "cuentas de
usuario + historial de viajes desde el inicio".

## Contexto

La planeación se abrió asumiendo cuentas e historial desde el primer día. Eso cambió: `tupu` es
un proyecto personal y la forma de trabajo es **empezar chico, probando, y añadir después** — sin
tomar atajos que haya que deshacer.

Con el alcance anterior, antes de ver la primera ruta en pantalla habría que construir registro,
login, sincronización y una pantalla de historial. Y lo que de verdad hay que validar temprano es
otra cosa: **si Valhalla da rutas ciclistas decentes en Lima**. Si eso sale mal, el resto no
importa.

## Decisión

El MVP tiene cuatro cosas, y ninguna más:

1. **Mapa con las ciclovías de Lima**, pintadas por encima del resto — que es la mejora directa
   sobre el prototipo.
2. **Ruta en bici entre dos puntos**, con distancia y tiempo estimado.
3. **Grabación local del recorrido** — se guarda en el teléfono, no en el servidor.
4. **La brújula**: ~~la flecha que apunta al destino~~ → un indicador de **hacia dónde mira el
   teléfono**, reflejado en el mapa. Redefinida por
   [0027](0027-brujula-muestra-hacia-donde-miras.md).

Queda **fuera** del MVP, en este orden para después:

1. Cuentas de usuario y sincronización del historial al servidor.
2. Rutas alternativas para comparar.
3. Uso sin señal (mapas descargados).
4. Isócronas y lo demás.

### Por qué estas cuatro y no menos

Las dos primeras validan la parte difícil de infraestructura. Las dos últimas son las que hacen
que la app **se sienta distinta** a abrir Google Maps — y son, no por casualidad, las dos piezas
más peliagudas del lado móvil: GPS en segundo plano con la pantalla apagada, y suavizar un
magnetómetro ruidoso ([0005](0005-expo-en-el-movil.md)). Dejarlas para después sería dejar el
riesgo para después.

## Consecuencias

**A favor**

- **El MVP no necesita autenticación.** Sin cuentas no hay tokens, ni sesiones, ni pantalla de
  registro. La decisión de auth queda aplazada, no resuelta a las apuradas.
- **El API del MVP es pequeño**: servir ciclovías y hacer de intermediario con Valhalla. De las
  cuatro áreas de [0008](0008-apps-api-por-funcionalidad.md), en el MVP existen dos —`cycleways` y
  `routing`— y las otras dos nacen vacías. La estructura aguanta igual.
- Se puede probar en la calle, en bici, mucho antes.

**En contra**

- **Los recorridos guardados en el teléfono se pierden** si se desinstala la app o se cambia de
  celular. Es aceptable para el MVP y es exactamente lo que resuelven las cuentas después.
- **Abre una decisión nueva**: cómo se guarda el recorrido localmente en el móvil. Y conviene
  elegirla pensando en que un día habrá que subirla al servidor, para no reescribir el modelo.
- **La forma de los datos de un recorrido se define dos veces** —una local y una en servidor— si
  no se cuida. `packages/contracts` ([0002](0002-layout-del-repo.md)) debería tener la definición
  desde ya, aunque en el MVP solo la use el móvil.
