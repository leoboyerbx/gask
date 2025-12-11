import type { GaskConfig } from '../..'
import type { BuildArgs } from '../../commands/_shared'
import consola from 'consola'
import { claspPush } from './clasp'

export async function claspPushIfNeeded(config: GaskConfig, args: BuildArgs) {
    if (args.push === undefined) {
        return
    }
    if (!config.claspProfiles || Object.keys(config.claspProfiles).length === 0) {
        throw new Error('No Clasp profiles defined in Gask config. At least one profile is required to push.')
    }
    let [profileName, profile] = Object.entries(config.claspProfiles || {})[0]!
    if (args.push) {
        profile = config.claspProfiles[args.push]
    }
    if (!profile) {
        throw new Error(`Profile "${args.push || profileName}" not found in Gask config.`)
    }
    consola.start(`Pushing to Clasp profile "${args.push || profileName}"...`)
    await claspPush(profile, config.outDir)
    consola.success('Push completed successfully.')
}
