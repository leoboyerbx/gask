import { defineCommand, runMain, showUsage } from 'citty'
import { consola } from 'consola'
import { version } from '../../package.json'
import { authCommand } from './auth'
import { buildCommand } from './build'
import { devCommand } from './dev'

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
            consola.info(`Gask CLI v${version}`)
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
