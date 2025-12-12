import { copyFile, readFile, unlink, writeFile } from 'node:fs/promises'
import { userInfo } from 'node:os'
import { resolve } from 'node:path'
import { spinner } from '@clack/prompts'
import nanoSpawn from 'nano-spawn'
import { detect, resolveCommand } from 'package-manager-detector'
import stringifyObject from 'stringify-object'

interface Options {
    projectName: string
    useEslint: boolean
    useGit: boolean
    packageManager: string
    scriptId?: string
}

export async function applyTemplateCustomizations(targetDir: string, options: Options) {
    const s = spinner({ indicator: 'dots' })
    s.start(`Installing dependencies with ${options.packageManager}...`)
    await customizePackageJson(targetDir, options)
    await installDependencies(targetDir, options.packageManager)
    s.stop('Dependencies installed successfully!')
    s.start('Applying project customizations...')
    await generateConfigFile(targetDir, options)
    await updateGitignore(targetDir)
    await createEnv(targetDir)
    if (!options.scriptId) {
        await initialBuild(targetDir)
    }
    s.stop('Customizations applied successfully!')
    if (options.scriptId) {
        s.start('Pulling Apps Script manifest...')
        try {
            await pullManifest(targetDir)
            await initialBuild(targetDir)
            s.stop('Apps Script manifest pulled successfully!')
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (_e: unknown) {
            s.stop('Could not pull Apps Script manifest. Please make sure your script ID is correct.', 2)
        }
    }
    if (options.useGit) {
        s.start('Initializing git repository...')
        await initializeGit(targetDir)
        s.stop('Git repository initialized successfully!')
    }
}

async function customizePackageJson(targetDir: string, options: Pick<Options, 'projectName' | 'useEslint'>) {
    const packageJsonPath = resolve(targetDir, 'package.json')
    const { default: packageJson } = await import(packageJsonPath, {
        with: {
            type: 'json',
        },
    })
    packageJson.name = options.projectName
    packageJson.author = userInfo().username
    if (!options.useEslint && packageJson.devDependencies) {
        for (const dep of Object.keys(packageJson.devDependencies)) {
            if (dep.toLowerCase().includes('eslint')) {
                delete packageJson.devDependencies[dep]
            }
        }
    }
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

async function generateConfigFile(targetDir: string, options: Pick<Options, 'scriptId'>) {
    const sourceConfigPath = resolve(targetDir, 'gask.config.template.ts')
    const destConfigPath = resolve(targetDir, 'gask.config.ts')

    const { default: configObject } = await import(sourceConfigPath)

    if (options.scriptId) {
        configObject.claspProfiles = { dev: { scriptId: options.scriptId } }
    }
    const configString = stringifyObject(configObject, { indent: '    ' })
    const fileContent = `import { defineConfig } from 'gask'\n\nexport default defineConfig(${configString})\n`

    await writeFile(destConfigPath, fileContent)
    await unlink(sourceConfigPath)
}

async function updateGitignore(targetDir: string) {
    const gitignorePath = resolve(targetDir, '.gitignore')
    const gitignoreContent = await readFile(gitignorePath, 'utf-8')
    const newContent = gitignoreContent
        .replace('gask.config.ts', '')
        .replace('src/appsscript.json', '')
        .replaceAll('\n\n\n', '\n\n')
        .trim()
    await writeFile(gitignorePath, newContent)
}

async function pullManifest(targetDir: string) {
    await runPkgScript(targetDir, ['gask', 'manifest', 'pull'])
}

async function runPkgScript(cwd: string, args: string[]) {
    const pm = await detect({
        cwd,
    })

    const command = resolveCommand(pm?.agent ?? 'npm', 'run', args)
    if (!command) {
        throw new Error('Could not resolve command to pull manifest')
    }

    await nanoSpawn(command.command, command.args, {
        cwd,
    })
}

async function createEnv(targetDir: string) {
    const envSource = resolve(targetDir, '.env.example')
    const envPath = resolve(targetDir, '.env')
    await copyFile(envSource, envPath)
}

async function installDependencies(targetDir: string, packageManager: string) {
    await nanoSpawn(packageManager, ['install'], {
        cwd: targetDir,
    })
}

async function initializeGit(targetDir: string) {
    await nanoSpawn('git', ['init'], {
        cwd: targetDir,
    })
}
async function initialBuild(targetDir: string) {
    await runPkgScript(targetDir, ['build'])
}
