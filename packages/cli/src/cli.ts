#!/usr/bin/env node
import { defineCommand, runMain, showUsage } from 'citty'
import { consola } from 'consola'
import { version } from '../package.json'
import { buildCommand } from './commands/build'
import { devCommand } from './commands/dev'

const main = defineCommand({
    meta: {
        name: 'gask',
        version,
        description: 'Gask CLI for Apps Script Projects',
    },
    subCommands: {
        build: buildCommand,
        dev: devCommand,
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
        await showUsage(main)
    },
})

runMain(main)
