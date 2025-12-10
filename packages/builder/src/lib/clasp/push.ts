import type { BASPConfig } from '../..'
import type { BuildArgs } from '../../commands/_shared'
import consola from 'consola'
import { claspPush } from './clasp'

export async function claspPushIfNeeded(config: BASPConfig, args: BuildArgs) {
    if (args.push === undefined) {
        return
    }
    let [profileName, profile] = Object.entries(config.claspProfiles || {})[0]!
    if (args.push) {
        profile = config.claspProfiles[args.push]
    }
    if (!profile) {
        throw new Error(`Profile "${args.push || profileName}" not found in basp config.`)
    }
    consola.start(`Pushing to Clasp profile "${args.push || profileName}"...`)
    await claspPush(profile, config.outDir)
    consola.success('Push completed successfully.')
}
