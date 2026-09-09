# 0009 — Despliegue en Dokploy sobre un VPS

**Estado:** Aceptada · 2026-09-08

## Contexto

Faltaba dónde vive el API. La restricción llegó del lado del equipo, no del análisis: el despliegue
se hace en **Dokploy**, la PaaS auto-hospedada que corre sobre un VPS propio con Docker y Traefik
por delante.

No es una decisión que haya que justificar contra alternativas —está tomada—, pero sí hay que
escribir **qué obliga**, porque toca varias piezas ya decididas.

## Decisión

Todo el lado servidor —API, base de datos y motor de ruteo— se despliega como proyecto de Dokploy
sobre un solo VPS, definido con Docker Compose. La app móvil no pasa por aquí: se distribuye por
EAS ([0005](0005-expo-en-el-movil.md)).

```
VPS
└── Dokploy
    ├── Traefik                 TLS con Let's Encrypt, único puerto público
    ├── api          (Bun)      ← lo único expuesto a internet
    ├── postgis                 red interna
    └── valhalla                red interna, NUNCA público
```

**Valhalla no se expone.** Solo el API lo alcanza, por la red interna del compose. Un motor de
ruteo abierto es CPU gratis para cualquiera que lo encuentre.

## Consecuencias

**A favor**

- **Confirma [0006](0006-valhalla-para-ruteo.md).** El self-host de Valhalla necesitaba una máquina
  con varios GB de RAM, y eso descartaba el hosting barato por función. Con un VPS propio deja de
  ser un problema y pasa a ser una línea del presupuesto.
- **Confirma [0007](0007-drizzle-para-acceso-a-datos.md) por un motivo nuevo.** Prisma habría
  necesitado *shadow database* en desarrollo, o sea permiso de `CREATE DATABASE` sobre el Postgres
  del VPS. Drizzle no necesita nada de eso.
- **Encaja con [0001](0001-monorepo-con-bun.md).** El Dockerfile del API ya se construye desde la
  raíz del repo, que es exactamente lo que Dokploy necesita para un monorepo.
- Sin cuotas ni cobro por petición en ninguna capa. El costo es fijo y conocido.

**En contra, y son cosas que hay que resolver**

- **El Postgres de Dokploy no trae PostGIS.** Su plantilla de base de datos usa la imagen oficial
  de `postgres`, que no incluye la extensión. Hay que levantar `postgis/postgis` — si Dokploy
  permite fijar la imagen del servicio, ahí; si no, como servicio dentro del compose, y entonces
  **se renuncia a los backups automáticos de su interfaz** y hay que montar un `pg_dump` propio a
  S3. Esto entra directo en el paso abierto de la planeación.
- **Los tiles de Valhalla no se pueden construir en cada despliegue.** Son decenas de minutos y
  varios GB. Van en un **volumen persistente**, y su reconstrucción es un trabajo aparte y manual,
  no parte del deploy. Un `git push` no puede tardar media hora.
- **Las migraciones necesitan un momento.** `drizzle-kit migrate` corre en el arranque del
  contenedor, antes de servir. Funciona con una sola réplica; el día que haya dos, dos contenedores
  migrando a la vez es un problema y habrá que sacarlo a un paso previo.
- **Un solo VPS es un solo punto de fallo**, y los tres servicios comparten su RAM. Valhalla es el
  que más pide: conviene dimensionar contando con él y no con el API.
- **La operación es nuestra**: actualizaciones del sistema, del propio Dokploy, certificados,
  espacio en disco, monitoreo. Es el precio de no pagar cuota, y es trabajo real y recurrente.

## Lo que queda por decidir aparte

- Cómo se hacen y se prueban los **backups** de la base, dado lo de PostGIS de arriba.
- Cada cuánto se **reconstruyen los tiles** de Valhalla, que ya estaba apuntado en
  [0006](0006-valhalla-para-ruteo.md) y ahora tiene dónde vivir.
- Si hay **entorno de pruebas** separado o se despliega directo a producción.
