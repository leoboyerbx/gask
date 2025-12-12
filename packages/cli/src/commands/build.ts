import process from 'node:process'
import { log, outro } from '@clack/prompts'
import { defineCommand } from 'citty'
import { buildProject } from '../lib/build'
import { claspPushIfNeeded } from '../lib/clasp/push'
import { loadGaskConfig } from '../lib/config'
import { commandIntro } from '../lib/console/intro'
import { buildArgs } from './_shared'

export const buildCommand = defineCommand({
    meta: {
        name: 'build',
        description: 'Build the project using esbuild',
    },
    args: buildArgs,
    async run({ args }) {
        commandIntro('Build')
        const { config } = await loadGaskConfig()
        try {
            await buildProject(config)
            await claspPushIfNeeded(config, args)
        }
        catch (e: any) {
            const errorMessage = e.errors?.[0].text || e.message || 'An unknown error occurred during the build process.'
            log.error(errorMessage)
            outro('Build command failed.')
            process.exit(1)
        }
        outro('Build command completed successfully.')
    },
})
