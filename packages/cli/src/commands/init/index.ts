import { resolve } from 'node:path'
import process from 'node:process'
import { confirm, group, log, outro, select, text } from '@clack/prompts'
import { defineCommand } from 'citty'
import { commandIntro } from '../../lib/console/intro'
import { exitWithError, handleCancel } from '../_utils'
import { applyTemplateCustomizations } from './customize'
import { downloadGaskTemplate } from './download'
import { selectTemplate } from './templates'

export const initCommand = defineCommand({
    meta: {
        name: 'init',
        description: 'Initialize a new Gask project',
    },
    args: {
        name: {
            type: 'positional',
            description: 'The name of the new project',
            required: false,
        },
        template: {
            type: 'string',
            description: 'The template to use for the new project',
            alias: 't',
        },
    },
    async run({ args }) {
        commandIntro('Initialize Gask Project')

        let projectName = args.name
        if (!projectName) {
            const answer = await text({
                message: 'Project name:',
                validate: (value) => {
                    if (value.length === 0)
                        return 'Project name cannot be empty'
                    if (/\s/.test(value))
                        return 'Project name cannot contain spaces'
                },
            })
            handleCancel(answer)
            projectName = answer
        }

        const template = await selectTemplate(args.template)
        const targetDir = resolve(process.cwd(), projectName)

        const userAgent = process.env.npm_config_user_agent
        const currentPm = userAgent ? userAgent.split('/')[0] : 'npm'
        const pmChoices = ['npm', 'pnpm', 'bun']
        const customizations = await group(
            {
                packageManager: () => select({
                    message: 'Package manager to use:',
                    options: pmChoices.map(pm => ({ value: pm, label: pm, hint: pm === currentPm ? 'current' : undefined })),
                    initialValue: currentPm,
                }),
                useEslint: () => confirm({
                    message: 'Add eslint for linting and formatting?',
                    initialValue: true,
                }),
                setupProfile: () => confirm({
                    message: 'Do you already have the ID of your Google Apps Script project?',
                    initialValue: false,
                }),
                scriptId: (({ results }) => {
                    if (results.setupProfile) {
                        return text({
                            message: 'Paste your Google Apps Script project ID:',
                            validate: (value) => {
                                if (value.length === 0)
                                    return 'Script ID cannot be empty'
                            },
                        })
                    }
                    return undefined
                }) as (opts: { results: { packageManager?: string | undefined, useEslint?: boolean | undefined, setupProfile?: boolean | undefined, scriptId?: unknown } }) => Promise<string | symbol | undefined> | undefined,
                useGit: () => confirm({
                    message: 'Initialize git repository?',
                    initialValue: true,
                }),
            },
            {
                onCancel: () => {
                    log.info('Operation cancelled.')
                    process.exit(0)
                },
            },
        )
        try {
            await downloadGaskTemplate(template, targetDir)
            await applyTemplateCustomizations(targetDir, { projectName, ...customizations })
            outro(`🎉 Your Gask project is ready!\nNext steps:\n - cd ${projectName}\n - ${customizations.packageManager} run dev`)
        }
        catch (error) {
            exitWithError(`Failed to setup template: ${(error as Error).message}`)
        }
    },
})
