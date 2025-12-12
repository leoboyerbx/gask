import type { Template } from './templates'
import { downloadTemplate } from 'giget'
import { exitWithError } from '../_utils'

export async function downloadGaskTemplate(template: Template, targetDir: string) {
    await downloadTemplate(`github:leoboyerbx/gask/templates/${template.path}`, {
        dir: targetDir,
    }).catch((err: any) => {
        exitWithError(`Failed to download template: ${err.message}`)
    })
}
