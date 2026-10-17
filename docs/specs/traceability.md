# Trazabilidad

Spec → código → verificación. Una fila por regla vigente.

| Spec | Origen | Código | Verificada |
|---|---|---|---|
| [SPEC-ROUTE-01](route.md#spec-route-01--el-destino-se-fija-con-un-toque-largo-o-pegando-coordenadas) | 0028 | `lib/coordinates.ts`, `components/route-panel.tsx` | En parte, 2026-10-16 |
| [SPEC-ROUTE-02](route.md#spec-route-02--sin-inicio-fijado-la-ruta-sale-de-la-posición-al-elegir-el-destino) | 0028 | `lib/route.ts` (`useRoutePlan`, `useRouteEndpoints`) | No |
| [SPEC-ROUTE-03](route.md#spec-route-03--el-api-distingue-no-hay-ruta-de-valhalla-no-responde) | 0029 | `features/routing/service.ts`, `shared/errors.ts` | En parte, 2026-10-16 |
| [SPEC-ROUTE-04](route.md#spec-route-04--la-app-dice-qué-pasó-con-la-ruta) | 0040 | `components/route-panel.tsx`, `components/route-layers.tsx`, `app/index.tsx` | No |
| [SPEC-CYCLE-01](cycleways.md#spec-cycle-01--cada-tramo-cae-en-una-de-tres-clases) | 0038 | `features/cycleways/ingest.ts`, `components/cycleway-layers.tsx`, `components/map-legend.tsx` | Lectura, 2026-10-16 |
| [SPEC-CYCLE-02](cycleways.md#spec-cycle-02--una-ingesta-que-encoge-la-red-a-menos-de-la-mitad-se-revierte) | 0020 | `features/cycleways/ingest.ts` (`replaceCycleways`) | Lectura, 2026-10-16 |
| [SPEC-CYCLE-03](cycleways.md#spec-cycle-03--la-red-viaja-entera-en-una-petición) | 0041 | `features/cycleways/queries.ts`, `lib/cycleways.ts` | En parte, 0041 |
| [SPEC-COMPASS-01](compass.md#spec-compass-01--el-cono-apunta-hacia-donde-mira-el-teléfono-sin-temblar) | 0025 | `lib/heading.ts`, `packages/geo/src/bearing.ts`, `components/rider-puck.tsx` | En la calle, 2026-09-10 |
| [SPEC-COMPASS-02](compass.md#spec-compass-02--cuando-la-brújula-no-sirve-la-app-lo-dice) | 0025 | `lib/heading.ts`, `app/index.tsx` | En parte, 2026-09-10 |
| [SPEC-CAMERA-01](camera.md#spec-camera-01--un-botón-cicla-tres-modos) | 0039 | `lib/camera.ts`, `components/camera-mode-button.tsx` | En la calle, 2026-09-10 |
| [SPEC-CAMERA-02](camera.md#spec-camera-02--la-cámara-se-mueve-solo-si-hace-falta) | 0039 | `lib/camera.ts` | En parte, 2026-09-10 |

Las rutas de `apps/mobile` y `apps/api/src` van sin ese prefijo.
