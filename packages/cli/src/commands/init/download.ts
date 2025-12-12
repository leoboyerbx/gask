import type { Template } from './templates'
import process from 'node:process'
import { spinner } from '@clack/prompts'
import { downloadTemplate } from 'giget'

export async function downloadGaskTemplate(template: Template, targetDir: string) {
    const s = spinner()
    s.start('Downloading template...')
    await downloadTemplate(`github:leoboyerbx/gask/templates/${template.path}`, {
        dir: targetDir,
    }).catch((err: any) => {
        s.stop(`Failed to download template: ${err.message}`, 1)
        process.exit(1)
    })
    s.stop('Template downloaded')
}
