import { access, constants, readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { type } from 'arktype'

export async function getAuthStatus() {
    const rc = await getGlobalRc()
    if (!rc) {
        return { authenticated: false }
    }
    console.log(rc)
}

const rcSchema = type({
    tokens: {
        default: {
            'client_id': 'string',
            'client_secret': 'string',
            'type?': 'string',
            'refresh_token': 'string',
            'access_token': 'string',
        },
    },
})

export async function getGlobalRc() {
    const globalRcPath = resolve(homedir(), '.clasprc.json')
    try {
        await access(globalRcPath, constants.R_OK)
    }
    catch {
        return null
    }

    try {
        const rcContent = await readFile(globalRcPath, 'utf8')
        const data = JSON.parse(rcContent)
        const parsed = rcSchema(data)
        if (parsed instanceof type.errors) {
            return null
        }
    }
    catch {
        return null
    }
}
