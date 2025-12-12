import { access } from 'node:fs/promises'
import { cancel, confirm, isCancel, log, outro, spinner } from '@clack/prompts'
import { defineCommand } from 'citty'
import { pullManifest } from '../lib/clasp/pull'
import { loadGaskConfig, resolveClaspProfile } from '../lib/config'
import { commandIntro } from '../lib/console/intro'

export const manifestCommand = defineCommand({
    meta: {
        name: 'manifest',
        description: 'Manage the Apps Script manifest file',
    },
    subCommands: {
        pull: defineCommand({
            meta: {
                name: 'pull',
                description: 'Pull the manifest file from Apps Script project to your manifest path',
            },
            args: {
                yes: {
                    alias: 'y',
                    type: 'boolean',
                    description: 'Automatically confirm overwriting the local manifest file',
                },
                profile: {
                    alias: 'p',
                    type: 'string',
                    description: 'Specify the clasp profile to use',
                },
            },
            async run({ args }) {
                commandIntro('Pull Manifest')
                const { config } = await loadGaskConfig()
                const existingManifest = await access(config.manifestPath).then(() => true).catch(() => false)
                if (existingManifest && !args.yes) {
                    const shouldContinue = await confirm({ message: 'You already have a local manifest file. Overwrite it with the one from your Apps Script Project?' })
                    if (!shouldContinue || isCancel(shouldContinue)) {
                        cancel('Pull cancelled.')
                        return
                    }
                }
                if (!config.claspProfiles || Object.keys(config.claspProfiles).length === 0) {
                    throw new Error('No clasp profiles found in configuration.')
                }
                const { profileName, profile } = resolveClaspProfile(config, args.profile as string)
                log.step(`Pulling manifest using profile: "${profileName}"`)
                const s = spinner()
                s.start('Pulling manifest...')
                await pullManifest(config.manifestPath, profile.scriptId)
                s.stop('Done.')
                outro('Manifest pulled successfully!')
            },
        }),
    },
})
