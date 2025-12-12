import { resolve } from 'node:path'
import nanoSpawn from 'nano-spawn'

interface Options {
    projectName: string
    useEslint: boolean
    useGit: boolean
    packageManager: string
    scriptId?: string
}

export async function applyTemplateCustomizations(targetDir: string, options: Options) {
    console.log('Applying customizations...')
    console.log({ targetDir, options })
    await installDependencies(targetDir, options.packageManager)
    await generateConfigFile(targetDir, options)
}

async function generateConfigFile(targetDir: string, options: Pick<Options, 'scriptId'>) {
    const sourceConfigPath = resolve(targetDir, 'gask.config.template.ts')
    const destConfigPath = resolve(targetDir, 'gask.config.ts')

    const configObject = await import(sourceConfigPath)
    console.log({ configObject })
}

async function installDependencies(targetDir: string, packageManager: string) {
    await nanoSpawn(packageManager, ['install'], {
        cwd: targetDir,
    })
}
