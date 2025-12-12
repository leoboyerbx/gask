import process from 'node:process'
import { isCancel, log, outro } from '@clack/prompts'

export function handleCancel<T>(result: T | symbol): asserts result is T {
    if (isCancel(result)) {
        log.info('Operation cancelled.')
        process.exit(0)
    }
}
export function exitWithError(message: string): never {
    log.error(message)
    outro('Exiting...')
    process.exit(1)
}
