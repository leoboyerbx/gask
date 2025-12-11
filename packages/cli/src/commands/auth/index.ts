import { defineCommand } from 'citty'
import { login } from './login'
import { logout } from './logout'

export const authCommand = defineCommand({
    meta: {
        name: 'auth',
        description: 'Manage authentication with Google. Uses @google/clasp under the hood.',
    },
    subCommands: {
        login,
        logout,
        // status,
    },
})
