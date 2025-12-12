import { log, select } from '@clack/prompts'
import { handleCancel } from '../_utils'

const templates = [
    { name: 'Default', description: 'A basic Gask project setup', path: 'default' },
] as const

export type Template = (typeof templates)[number]

export async function selectTemplate(requiredName?: string) {
    let showChoice = templates.length > 1
    if (requiredName) {
        const template = templates.find(t => t.name.toLowerCase() === requiredName.toLowerCase())
        if (template) {
            return template
        }
        log.warn(`Template "${requiredName}" not found.`)
        showChoice = true
    }
    if (showChoice) {
        const templateName = await select({
            message: 'Select a template:',
            options: templates.map(t => ({ value: t.name, label: t.name, hint: t.description })),
        })
        handleCancel(templateName)
        return templates.find(t => t.name === templateName)!
    }

    return templates[0]
}
