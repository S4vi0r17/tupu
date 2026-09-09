// Metro no sabe de workspaces: hay que decirle dónde está la raíz del monorepo
// y desde qué node_modules resolver, o los paquetes de packages/* no se ven (0002).
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
// ! El node_modules aplanado de Bun deja resolver cualquier cosa desde arriba;
// ! esto obliga a que una dependencia esté declarada para poder importarse (0001).
config.resolver.disableHierarchicalLookup = true

module.exports = config
