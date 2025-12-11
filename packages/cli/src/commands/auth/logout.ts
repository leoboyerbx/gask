import { defineCommand } from 'citty'
import { runClasp } from '../../lib/clasp/clasp'

export const logout = defineCommand({
    meta: {
        name: 'logout',
        description: 'Log out from Google account.',
    },
    async run() {
        await runClasp(['logout'])
    },
})
