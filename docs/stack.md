# Stack

| Capa | Se usa | No usar | |
|---|---|---|---|
| Runtime y paquetes | Bun, enlazador aislado | npm, pnpm, yarn, Node | 0001, 0037 |
| API | Hono | Express, NestJS | 0004 |
| Base de datos | PostgreSQL + PostGIS | `jsonb` para geometrías | 0011 |
| Acceso a datos | Drizzle, también en el teléfono | Prisma, SQL suelto | 0007, 0033 |
| Contratos | Zod | tipos escritos a mano | 0032 |
| Lint y formato | Biome | ESLint, Prettier | 0031 |
| Móvil | Expo, Expo Router, Zustand, TanStack Query | Redux, Context para estado compartido | 0005, 0014 |
| Estilos | NativeWind 5 con Tailwind 4 | `StyleSheet` a secas | 0036 |
| Mapa | MapLibre con tiles de OpenFreeMap | react-native-maps, Mapbox | 0005, 0016 |
| Ruteo | Valhalla propio | OSRM, Google, Mapbox | 0006 |
| Posición | `expo-location`, con Google Play Services | el `LocationManager` de MapLibre | 0015, 0040 |
| Guardado local | SQLite con `expo-sqlite` | AsyncStorage | 0013 |
| Despliegue | Dokploy en un VPS, sin CI | | 0009, 0023 |
| Tests | Ninguno todavía | agregar tests sin hablarlo | 0024 |
