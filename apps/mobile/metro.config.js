// Metro no sabe de workspaces: sin esto no ve packages/* (0002)
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

// Sin disableHierarchicalLookup: con el enlazador aislado de Bun rompe la resolución (0037)
module.exports = withNativewind(config, {
  // className en View y Text sin envolverlos
  globalClassNamePolyfill: true,
  // Sin él, Tailwind busca las clases en otra carpeta y no genera ninguna (0036)
  projectRoot,
})
