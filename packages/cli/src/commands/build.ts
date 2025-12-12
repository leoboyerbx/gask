import process from 'node:process'
import { defineCommand } from 'citty'
import consola from 'consola'
import { buildProject } from '../lib/build'
import { claspPushIfNeeded } from '../lib/clasp/push'
import { loadGaskConfig } from '../lib/config'
import { buildArgs } from './_shared'

export const buildCommand = defineCommand({
    meta: {
        name: 'build',
        description: 'Build the project using esbuild',
    },
    args: buildArgs,
    async run({ args }) {
        const { config } = await loadGaskConfig()
        try {
            await buildProject(config)
            await claspPushIfNeeded(config, args)
        }
        catch (e: any) {
            const errorMessage = e.errors?.[0].text || e.message || 'An unknown error occurred during the build process.'
            consola.error(errorMessage)
            process.exit(1)
        }
    },
})
