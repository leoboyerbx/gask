import { getLoggedInUser } from './api'
import { getGlobalRc } from './rc'

export async function getAuthStatus(): Promise<{ authenticated: false } | { authenticated: true, email: string }> {
    const rc = await getGlobalRc()
    if (!rc) {
        return { authenticated: false }
    }
    const tokens = rc.tokens.default
    const user = await getLoggedInUser(tokens, true)

    return user ? { authenticated: true, email: user.email } : { authenticated: false }
}
