import type { PluginBuild } from 'esbuild'
import { dirname, resolve } from 'node:path'

export function getEsbuildInOut(build: PluginBuild) {
    if (!Array.isArray(build.initialOptions.entryPoints) || typeof build.initialOptions.entryPoints[0] !== 'string') {
        throw new TypeError('esbuildExposeGlobals plugin requires entryPoints to be set as an array with at least one entry point.')
    }
    if (!build.initialOptions.outfile) {
        throw new TypeError('esbuildExposeGlobals plugin requires outfile to be set.')
    }
    const entryFile = resolve(build.initialOptions.entryPoints[0])
    const outFile = resolve(build.initialOptions.outfile)
    const outDir = dirname(outFile)

    return { entryFile, outFile, outDir }
}
