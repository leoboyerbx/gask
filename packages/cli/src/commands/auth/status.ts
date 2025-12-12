import { outro, spinner } from '@clack/prompts'
import { defineCommand } from 'citty'
import { getAuthStatus } from '../../lib/clasp/auth'
import { commandIntro } from '../../lib/console/intro'

export const status = defineCommand({
    meta: {
        name: 'status',
        description: 'Get clasp auth status.',
    },
    async run() {
        commandIntro('Auth Status')
        const s = spinner()
        s.start('Checking authentication status...')
        const status = await getAuthStatus()
        if (status.authenticated) {
            s.stop(`Authenticated as ${status.email}.`, 0)
        }
        else {
            s.stop('Not authenticated. Run "gask auth login" to authenticate.', 1)
        }
        outro('Done.')
    },
})
