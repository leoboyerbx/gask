import { log } from '@clack/prompts'
import { defineCommand, runMain, showUsage } from 'citty'
import { version } from '../../package.json'
import { commandIntro } from '../lib/console/intro'
import { authCommand } from './auth'
import { buildCommand } from './build'
import { devCommand } from './dev'
import { initCommand } from './init'
import { manifestCommand } from './manifest'

export const mainCommand = defineCommand({
    meta: {
        name: 'gask',
        version,
        description: 'Gask CLI for Apps Script Projects',
    },
    subCommands: {
        build: buildCommand,
        dev: devCommand,
        auth: authCommand,
        manifest: manifestCommand,
        init: initCommand,
    },
    args: {
        version: {
            type: 'boolean',
            alias: 'v',
            description: 'Show version number',
        },
    },
    async run({ args }) {
        if (args.version !== undefined) {
            commandIntro('CLI')
            log.info(`v${version}`)
            return
        }
        if (args._.length === 0) {
            await showUsage(mainCommand)
        }
    },
})

export function runMainCommand() {
    runMain(mainCommand)
}
