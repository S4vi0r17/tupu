import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  VALHALLA_URL: z.url(),
})

function loadConfig() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const detail = z.flattenError(parsed.error).fieldErrors
    console.error('Configuración inválida:', detail)
    // throw y no process.exit: el móvil compila este archivo al importar AppType
    throw new Error('Faltan variables de entorno. Ver .env.example')
  }

  return parsed.data
}

export const config = loadConfig()
