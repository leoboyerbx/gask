import { intro } from '@clack/prompts'
import { colors } from 'consola/utils'

export function commandIntro(command: string) {
    intro(colors.bold(colors.bgGreen(`Gask: ${command}`)))
}
