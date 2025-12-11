import type { ClaspTokens } from './rc'
import { ofetch } from 'ofetch'
import { updateDefaultAccessToken } from './rc'

export async function getLoggedInUser(tokens: ClaspTokens, tryRefresh = true) {
    try {
        const result = await fetchUserInfo(tokens.access_token)
        return result
    }
    catch (err: any) {
        if (err?.status === 401 && tryRefresh) {
            // Access token might be expired, try to refresh
            if (await refreshAccessToken(tokens)) {
                return getLoggedInUser(tokens, false)
            }
            return null
        }
        return null
    }
}

async function fetchUserInfo(accessToken: string) {
    const res = await ofetch<{ email: string }>('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return res
}

async function refreshAccessToken(tokens: ClaspTokens) {
    const body = new FormData()
    body.append('client_id', tokens.client_id)
    body.append('client_secret', tokens.client_secret)
    body.append('refresh_token', tokens.refresh_token)
    body.append('grant_type', 'refresh_token')
    try {
        const res = await ofetch<{ access_token: string }>('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body,
        })
        tokens.access_token = res.access_token
        await updateDefaultAccessToken(res.access_token)
        return true
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
        return false
    }
}
