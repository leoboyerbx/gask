import type { BuildOptions } from 'esbuild'
import type { GaskConfig } from '..'
import { resolve } from 'node:path'

import { spinner } from '@clack/prompts'

import { build } from 'esbuild'
import { esbuildCopyManifest } from '../lib/esbuild/copyManifest'
import { esbuildExposeGlobals } from '../lib/esbuild/exposeGlobals'
import { esbuildInjectEnv } from '../lib/esbuild/injectEnv'

export async function buildProject(config: GaskConfig) {
    const esbuildOptions: BuildOptions = {
        entryPoints: [config.entryFile],
        outfile: resolve(config.outDir, 'Code.js'),
        format: 'iife',
        bundle: true,
        plugins: [
            esbuildInjectEnv({ prefix: config.envPrefix, declarationPath: config.envDeclarationPath }),
            esbuildExposeGlobals(),
            esbuildCopyManifest(config.manifestPath, Object.keys(config.claspProfiles ?? {}).length > 0), // Throw if missing only if has clasp profiles
        ],
        banner: {
            js: `// DO NOT EDIT THIS CODE DIRECTLY. THIS IS AN AUTO-GENERATED FILE.
// Refer to ${config.repoUrl || 'your repo'} for the source code and build instructions.`,
        },
    }
    const s = spinner()
    s.start('Building project...')
    try {
        await build(esbuildOptions)
    }
    catch (e) {
        s.stop('Build failed.', 1)
        throw e
    }
    s.stop('Build sucessful.')
}
