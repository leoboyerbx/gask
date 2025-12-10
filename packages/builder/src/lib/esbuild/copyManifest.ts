import type { Plugin } from 'esbuild'
import { copyFile } from 'node:fs/promises'
import { getEsbuildInOut } from './_utils'

export function esbuildCopyManifest(sourceManifestPath: string) {
    return {
        name: 'basp-copy-manifest',
        setup(build) {
            const { outDir } = getEsbuildInOut(build)
            build.onEnd(async () => {
                await copyFile(sourceManifestPath, `${outDir}/appsscript.json`)
            })
        },
    } satisfies Plugin
}
