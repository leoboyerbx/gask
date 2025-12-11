import type { GaskConfig } from '..'
import { dirname, resolve } from 'node:path'

import process from 'node:process'
import { loadConfig } from 'c12'

export async function loadGaskConfig() {
    const { config, configFile } = await loadConfig<GaskConfig>({
        name: 'gask',
        dotenv: true,
        defaultConfig: {
            claspProfiles: {},
            entryFile: 'src/index.ts',
            outDir: 'dist',
            manifestPath: 'src/appsscript.json',
            watchPaths: [],
        },
    })
    if (config.watchPaths.length === 0) {
        config.watchPaths = [dirname(config.entryFile)]
    }
    return { config: resolveConfigPaths(config), configFile }
}

function resolveConfigPaths(config: GaskConfig) {
    config.entryFile = resolve(process.cwd(), config.entryFile)
    config.outDir = resolve(process.cwd(), config.outDir)
    config.manifestPath = resolve(process.cwd(), config.manifestPath)
    if (config.envDeclarationPath) {
        config.envDeclarationPath = resolve(process.cwd(), config.envDeclarationPath)
    }
    if (config.watchPaths) {
        config.watchPaths = config.watchPaths.map(p => resolve(process.cwd(), p))
    }
    return config
}
