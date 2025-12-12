import type { Plugin } from 'esbuild'
import { access, copyFile } from 'node:fs/promises'
import { getEsbuildInOut } from './_utils'

export function esbuildCopyManifest(sourceManifestPath: string, throwIfMissing = true) {
    return {
        name: 'gask-copy-manifest',
        setup(build) {
            const { outDir } = getEsbuildInOut(build)
            build.onEnd(async () => {
                const exists = await access(sourceManifestPath).then(() => true).catch(() => false)
                if (!exists) {
                    if (throwIfMissing) {
                        throw new Error(`Manifest file not found at path: ${sourceManifestPath}`)
                    }
                    return
                }
                await copyFile(sourceManifestPath, `${outDir}/appsscript.json`)
            })
        },
    } satisfies Plugin
}
