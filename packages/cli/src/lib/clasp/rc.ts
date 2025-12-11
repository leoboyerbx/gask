import { access, constants, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { type } from 'arktype'

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

export type ClaspRcSchema = typeof rcSchema.infer
export type ClaspTokens = typeof rcSchema.infer['tokens']['default']

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
        return parsed
    }
    catch {
        return null
    }
}

export async function writeGlobalRc(rc: ClaspRcSchema) {
    const globalRcPath = resolve(homedir(), '.clasprc.json')
    const rcContent = JSON.stringify(rc, null, 2)
    await writeFile(globalRcPath, rcContent)
}

export async function updateDefaultAccessToken(newAccessToken: string) {
    const rc = await getGlobalRc()
    if (!rc) {
        throw new Error('No .clasprc.json found')
    }
    rc.tokens.default.access_token = newAccessToken
    await writeGlobalRc(rc)
}
