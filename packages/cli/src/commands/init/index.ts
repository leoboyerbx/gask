import { defineCommand } from 'citty'
import { commandIntro } from '../../lib/console/intro'

export const initCommand = defineCommand({
    meta: {
        name: 'init',
        description: 'Initialize a new Gask project',
    },
    async run() {
        commandIntro('Initialize Gask Project')
    },
})
