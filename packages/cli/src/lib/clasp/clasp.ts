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
            scriptId: profile.scriptId,
            rootDir,
        })
    }
    catch (err) {
        consola.error('Error while pushing :', err)
        process.exit(1)
    }
}

export async function runClasp(args: string[], claspConfig?: any) {
    const require = createRequire(import.meta.url)
    const claspPath = require.resolve('@google/clasp')

    const tmpClaspPath = join(tmpdir(), `gask-build-${randomUUID()}.json`)
    if (claspConfig) {
        await writeFile(tmpClaspPath, JSON.stringify(claspConfig, null, 2))
        args.push('--project', tmpClaspPath)
    }

    const result = await nanoSpawn('node', [claspPath, ...args], {
        stdio: 'inherit',
    })
    if (claspConfig) {
        await rm(tmpClaspPath, { force: true }).catch(() => {})
    }
    return result
}
