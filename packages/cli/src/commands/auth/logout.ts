import { outro, spinner } from '@clack/prompts'
import { defineCommand } from 'citty'
import { runClasp } from '../../lib/clasp/clasp'
import { commandIntro } from '../../lib/console/intro'

export const logout = defineCommand({
    meta: {
        name: 'logout',
        description: 'Log out from Google account.',
    },
    async run() {
        commandIntro('Logout')
        const s = spinner()
        s.start('Logging out your clasp account...')
        await runClasp(['logout'], { interactive: false })
        s.stop('Logged out successfully.')
        outro('Logout command done.')
    },
})
