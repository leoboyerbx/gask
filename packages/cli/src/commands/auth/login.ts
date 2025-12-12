import { outro } from '@clack/prompts'
import { defineCommand } from 'citty'
import { runClasp } from '../../lib/clasp/clasp'
import { commandIntro } from '../../lib/console/intro'

export const login = defineCommand({
    meta: {
        name: 'login',
        description: 'Log in to Google account. Same options as https://github.com/google/clasp?tab=readme-ov-file#login',
    },
    async run({ rawArgs }) {
        commandIntro('Login')
        await runClasp(['login', ...rawArgs], { interactive: true })
        outro('Login completed successfully.')
    },
})
