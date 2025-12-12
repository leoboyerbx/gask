import { randomUUID } from 'node:crypto'
import { copyFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runClasp } from './clasp'

export async function pullManifest(pullPath: string, scriptId: string) {
    const tmpDir = join(tmpdir(), `gask-pull-${randomUUID()}`)
    await mkdir(tmpDir, {
        recursive: true,
    })
    await runClasp(['pull', '--force'], {
        claspConfig: {
            scriptId,
            rootDir: tmpDir,
        },
    })
    const sourcePath = join(tmpDir, 'appsscript.json')
    await copyFile(sourcePath, pullPath)
}
