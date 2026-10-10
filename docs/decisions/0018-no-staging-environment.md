# 0018 — Sin entorno de pruebas: solo producción y local

Aceptada · 2026-09-08

## Contexto

Un staging sería un segundo proyecto de Dokploy con su base y su Valhalla (0009).

## Decisión

Solo producción. Se prueba en local con el mismo compose que corre en el VPS.

- Valhalla pide RAM: duplicarlo compite con producción o duplica el costo.
- No hay usuarios que proteger.

Cambia cuando haya gente usando la app.

## Se paga

- Un despliegue malo se ve en producción.
- Las migraciones se prueban con datos de juguete.
- Dokploy y su configuración se prueban en caliente.

## Descartado

- **Staging en el mismo VPS.** Compite por la RAM.
- **Staging en otro VPS.** Costo y mantenimiento dobles sin usuarios.
