import type { ClaspProfile } from '../..'
import { randomUUID } from 'node:crypto'
import { rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import nanoSpawn from 'nano-spawn'
import { resolveCommand } from 'package-manager-detector/commands'
import { detect } from 'package-manager-detector/detect'

export async function claspPush(profile: ClaspProfile, rootDir: string) {
    const tmpClaspPath = join(tmpdir(), `gas-builder-${randomUUID()}.json`)

    const claspConfig = {
        scriptId: profile.scriptId,
        rootDir,
    }

    try {
        await writeFile(tmpClaspPath, JSON.stringify(claspConfig, null, 2))

        const pm = await detect()

        const args = ['clasp', 'push', '-f', '--project', tmpClaspPath]
        const cmd = resolveCommand(pm?.agent || 'npm', 'execute', args)
        if (!cmd)
            throw new Error('Could not detect package manager')

        await nanoSpawn(cmd.command, cmd.args, {
            stdio: 'inherit',
        })
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
