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
    const tmpClaspPath = join(tmpdir(), `gask-build-${randomUUID()}.json`)

    const claspConfig = {
        scriptId: profile.scriptId,
        rootDir,
    }

    try {
        await writeFile(tmpClaspPath, JSON.stringify(claspConfig, null, 2))
        await runClasp(['push', '--project', tmpClaspPath])
    }
    catch (err) {
        consola.error('Error while pushing :', err)
        process.exit(1)
    }
    finally {
        try {
            await rm(tmpClaspPath, { force: true })
        }
        catch {
            // Ignore cleanup errors
        }
    }
}

export async function runClasp(args: string[]) {
    const require = createRequire(import.meta.url)
    const claspPath = require.resolve('@google/clasp')
    return await nanoSpawn('node', [claspPath, ...args], {
        stdio: 'inherit',
    })
}
