#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { version } from '../package.json'
import { buildCommand } from './commands/build'
import { devCommand } from './commands/dev'

const main = defineCommand({
    meta: {
        name: 'gask',
        version,
        description: 'Gask Builder for Apps Script Projects',
    },
    subCommands: {
        build: buildCommand,
        dev: devCommand,
    },
})

runMain(main)
