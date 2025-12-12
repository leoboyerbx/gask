import type { GaskConfig } from '../..'
import type { BuildArgs } from '../../commands/_shared'
import { log } from '@clack/prompts'
import { resolveClaspProfile } from '../config'
import { claspPush } from './clasp'

export async function claspPushIfNeeded(config: GaskConfig, args: BuildArgs) {
    if (args.push === undefined) {
        return
    }

    const { profileName, profile } = resolveClaspProfile(config, args.push)

    log.step(`Pushing to Clasp profile "${profileName}"...`)
    await claspPush(profile, config.outDir)
    log.success('Push completed successfully.')
}
