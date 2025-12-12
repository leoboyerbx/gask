import type { GaskConfig } from '..'
import { dirname, resolve } from 'node:path'

import process from 'node:process'
import { loadConfig } from 'c12'

export async function loadGaskConfig() {
    const { config, configFile } = await loadConfig<GaskConfig>({
        name: 'gask',
        dotenv: true,
        defaultConfig({ configs }) {
            let manifestPath = 'src/appsscript.json'
            if (configs.main?.entryFile) {
                manifestPath = `${dirname(configs.main.entryFile)}/appsscript.json`
            }
            return {
                entryFile: 'src/index.ts',
                outDir: 'dist',
                manifestPath,
                watchPaths: [],
            }
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

export function resolveClaspProfile(config: GaskConfig, requiredName?: string) {
    if (!config.claspProfiles || Object.keys(config.claspProfiles).length === 0) {
        throw new Error('No Clasp profiles defined in Gask config. At least one profile is required.')
    }
    let [profileName, profile] = Object.entries(config.claspProfiles || {})[0]!
    if (requiredName) {
        profile = config.claspProfiles[requiredName]
    }
    if (!profile) {
        throw new Error(`Profile "${requiredName || profileName}" not found in Gask config.`)
    }
    profileName = requiredName || profileName
    return { profileName, profile }
}
