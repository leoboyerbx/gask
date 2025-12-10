import process from 'node:process'
import chokidar from 'chokidar'
import { defineCommand } from 'citty'
import consola from 'consola'
import { glob } from 'tinyglobby'
import { buildProject } from '../lib/build'
import { claspPushIfNeeded } from '../lib/clasp/push'
import { loadBaspConfig } from '../lib/config'
import { buildArgs } from './_shared'

export const devCommand = defineCommand({
    meta: {
        name: 'dev',
        description: 'Run the project in watch mode',
    },
    args: buildArgs,
    async run({ args }) {
        const { config, configFile } = await loadBaspConfig()
        const envFiles = await glob(['.env', '.env.*'], {
            cwd: process.cwd(),
            absolute: true,
            onlyFiles: true,
            ignore: ['.env.example'],
        })
        const watchPaths = [...(config.watchPaths ?? []), ...envFiles]
        if (configFile) {
            watchPaths.push(configFile)
        }

        async function rebuild(initial: boolean = false) {
            if (!initial) {
                consola.log('Changes detected. Rebuilding...')
            }
            // Reload config to pick up any changes
            const { config } = await loadBaspConfig()
            await buildProject(config)
            await claspPushIfNeeded(config, args)
        }
        await rebuild(true)
        consola.success('Initial build completed. Watching for changes...')

        const ignored = []
        if (config.envDeclarationPath) {
            ignored.push(config.envDeclarationPath)
        }
        chokidar
            .watch(watchPaths, {
                cwd: process.cwd(),
                ignoreInitial: true,
                ignored,
            })
            .on('add', () => rebuild())
            .on('change', () => rebuild())
            .on('unlink', () => rebuild())
    },
})
