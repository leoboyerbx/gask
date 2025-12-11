import { defineCommand } from 'citty'
import consola from 'consola'
import { getAuthStatus } from '../../lib/clasp/auth'

export const status = defineCommand({
    meta: {
        name: 'status',
        description: 'Get clasp auth status.',
    },
    async run() {
        const status = await getAuthStatus()
        if (status.authenticated) {
            consola.success(`Authenticated as ${status.email}.`)
        }
        else {
            consola.fail('Not authenticated. Run "gask auth login" to authenticate.')
        }
    },
})
