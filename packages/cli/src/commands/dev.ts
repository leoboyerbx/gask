import process from 'node:process'
import { log } from '@clack/prompts'
import chokidar from 'chokidar'
import { defineCommand } from 'citty'
import { glob } from 'tinyglobby'
import { buildProject } from '../lib/build'
import { claspPushIfNeeded } from '../lib/clasp/push'
import { loadGaskConfig } from '../lib/config'
import { commandIntro } from '../lib/console/intro'
import { buildArgs } from './_shared'

export const devCommand = defineCommand({
    meta: {
        name: 'dev',
        description: 'Run the project in watch mode',
    },
    args: buildArgs,
    async run({ args }) {
        commandIntro('Development mode')
        const { config, configFile } = await loadGaskConfig()
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
                log.info('Changes detected. Rebuilding...')
            }
            // Reload config to pick up any changes
            const { config } = await loadGaskConfig()
            try {
                await buildProject(config)
            }
            catch (e: any) {
                const errorMessage = e?.errors?.[0]?.text
                log.error(`Build failed: ${errorMessage || e.message || e}`)
                log.info('Waiting for changes before retry...')
                return
            }
            await claspPushIfNeeded(config, args)
        }
        await rebuild(true)
        log.success('Initial build completed. Watching for changes...')

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
