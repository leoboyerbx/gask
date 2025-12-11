import type { ArgsDef, ParsedArgs } from 'citty'

export const buildArgs = {
    push: {
        type: 'string',
        alias: 'p',
        valueHint: 'profile',
        description: 'If present, will push to the specified Clasp profile after building.',
    },
} satisfies ArgsDef

export type BuildArgs = ParsedArgs<typeof buildArgs>
