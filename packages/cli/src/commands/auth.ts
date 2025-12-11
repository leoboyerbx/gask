import { defineCommand } from 'citty'
import { runClasp } from '../lib/clasp/clasp'

export const authCommand = defineCommand({
    meta: {
        name: 'auth',
        description: 'Manage authentication with Google. Uses @google/clasp under the hood.',
    },
    subCommands: {
        login: defineCommand({
            meta: {
                name: 'login',
                description: 'Log in to Google account. Same options as https://github.com/google/clasp?tab=readme-ov-file#login',
            },
            async run({ rawArgs }) {
                await runClasp(['login', ...rawArgs])
            },
        }),
        logout: defineCommand({
            meta: {
                name: 'logout',
                description: 'Log out from Google account.',
            },
            async run() {
                await runClasp(['logout'])
            },
        }),
    },
})
