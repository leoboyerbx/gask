import { defineCommand } from 'citty'
import { getAuthStatus } from '../../lib/clasp/auth'

export const status = defineCommand({
    meta: {
        name: 'status',
        description: 'Get clasp auth status.',
    },
    async run() {
        // const status = getAuthStatus()
    },
})
