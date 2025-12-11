import { defineCommand } from 'citty'
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
        await buildProject(config)
        await claspPushIfNeeded(config, args)
    },
})
