import { defineCommand } from 'citty'
import { runClasp } from '../../lib/clasp/clasp'

export const login = defineCommand({
    meta: {
        name: 'login',
        description: 'Log in to Google account. Same options as https://github.com/google/clasp?tab=readme-ov-file#login',
    },
    async run({ rawArgs }) {
        await runClasp(['login', ...rawArgs], { interactive: true })
    },
})
