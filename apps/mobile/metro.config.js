// Metro no sabe de workspaces: hay que decirle dónde está la raíz del monorepo
// y desde qué node_modules resolver, o los paquetes de packages/* no se ven (0002).
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// ! NO pongas disableHierarchicalLookup acá. Bun instala aislado, así que cada
// ! paquete guarda sus dependencias en su propio node_modules, y resolver
// ! subiendo desde el archivo que importa es justo lo que lo hace funcionar (0037).
// globalClassNamePolyfill deja usar className en View y Text sin envolverlos
// ! projectRoot explícito: sin él, en un monorepo Tailwind busca las clases
// ! desde otra carpeta y compila un CSS sin ninguna utilidad.
module.exports = withNativewind(config, {
  globalClassNamePolyfill: true,
  projectRoot,
})
