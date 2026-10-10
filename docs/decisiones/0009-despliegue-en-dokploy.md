# 0009 — Despliegue en Dokploy sobre un VPS

Aceptada · 2026-09-08

## Contexto

El servidor se despliega en Dokploy: una plataforma propia sobre un VPS, con Docker y Traefik. Es
una condición dada, no una elección entre alternativas. Falta escribir qué obliga.

## Decisión

API, base de datos y Valhalla en un proyecto de Dokploy, en un solo VPS, con Docker Compose.

```
VPS
└── Dokploy
    ├── Traefik     TLS, el único puerto público
    ├── api         lo único expuesto
    ├── postgis     red interna
    └── valhalla    red interna, nunca público
```

Un motor de ruteo abierto es CPU gratis para cualquiera.

Valhalla necesita RAM fija, y un VPS la da sin cobro por petición. Drizzle no necesita permisos
para crear bases en el VPS, cosa que Prisma sí (0007).

## Se paga

- La plantilla de Postgres de Dokploy no trae PostGIS. Va dentro del compose, y así se pierden
  los backups de su interfaz (0017).
- El grafo de Valhalla no se construye en cada despliegue: vive en un volumen y se reconstruye a
  mano (0020).
- Las migraciones corren al arrancar el API. Con dos réplicas habrá que sacarlas.
- Un VPS es un solo punto de fallo, y los tres servicios comparten su RAM.
- La operación es propia: sistema, Dokploy, certificados, disco.
