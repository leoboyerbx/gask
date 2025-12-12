import type { ClaspProfile } from '../..'
import { randomUUID } from 'node:crypto'
import { rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import nanoSpawn from 'nano-spawn'

export async function claspPush(profile: ClaspProfile, rootDir: string) {
    try {
        await runClasp(['push'], {
            claspConfig: {
                scriptId: profile.scriptId,
                rootDir,
            },
            interactive: true,
        })
    }
    catch (err) {
        consola.error('Error while pushing :', err)
        process.exit(1)
    }
}

export async function runClasp(args: string[], options: {
    claspConfig?: any
    interactive?: boolean
} = {}) {
    const require = createRequire(import.meta.url)
    const claspPath = require.resolve('@google/clasp')

    const tmpClaspPath = join(tmpdir(), `gask-build-${randomUUID()}.json`)
    if (options.claspConfig) {
        await writeFile(tmpClaspPath, JSON.stringify(options.claspConfig, null, 2))
        args.push('--project', tmpClaspPath)
    }

    const spawnOptions = options.interactive ? { stdio: 'inherit' } as const : {}
    const result = await nanoSpawn('node', [claspPath, ...args], spawnOptions)
    if (options.claspConfig) {
        await rm(tmpClaspPath, { force: true }).catch(() => {})
    }
    return result
}
