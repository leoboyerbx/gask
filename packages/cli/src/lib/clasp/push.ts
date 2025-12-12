import type { GaskConfig } from '../..'
import type { BuildArgs } from '../../commands/_shared'
import consola from 'consola'
import { resolveClaspProfile } from '../config'
import { claspPush } from './clasp'

export async function claspPushIfNeeded(config: GaskConfig, args: BuildArgs) {
    if (args.push === undefined) {
        return
    }

    const { profileName, profile } = resolveClaspProfile(config, args.push)

    consola.start(`Pushing to Clasp profile "${profileName}"...`)
    await claspPush(profile, config.outDir)
    consola.success('Push completed successfully.')
}
