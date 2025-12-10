import type { Plugin } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { getEsbuildInOut } from './_utils'

export function esbuildExposeGlobals() {
    return {
        name: 'gask-expose-globals',
        setup(build) {
            const { entryFile, outFile } = getEsbuildInOut(build)

            const filter = new RegExp(entryFile)
            let exposedFunctionsNames = [] as string[]
            build.onStart(() => {
                exposedFunctionsNames = []
            })
            build.onLoad({ filter }, async (args) => {
                const source = await readFile(args.path, 'utf8')
                const match = source.match(/export\s+default\s*\{([\s\S]*?)\}/)
                if (!match) {
                    return { contents: source, loader: 'ts' }
                }

                const rawProps = match[1]
                    .split(',')
                    .map(p => p.trim())
                    .filter(p => p && !p.startsWith('//') && !p.startsWith('/*'))

                const assignments = rawProps.map((prop) => {
                    if (prop.includes(':')) {
                        const [key, val] = prop.split(':').map(s => s.trim())
                        exposedFunctionsNames.push(key)
                        return `global.${key} = ${val};`
                    }
                    exposedFunctionsNames.push(prop)
                    return `global.${prop} = ${prop};`
                }).join('\n')

                const newContents = `
        ${source}

        // --- AUTO-GENERATED FOR GAS ---
        declare const global: any;
        ${assignments}
      `
                return { contents: newContents, loader: 'ts' }
            })

            build.onEnd(async () => {
                let content = await readFile(outFile, 'utf8')

                let stubs = '\nvar global = this;\n\n'
                for (const name of exposedFunctionsNames) {
                    stubs += `function ${name}() {}\n\n`
                }

                if (build.initialOptions.banner?.js) {
                // if the banner is present, append the stubs after the banner
                    content = content.replace(build.initialOptions.banner.js, `${build.initialOptions.banner.js}\n${stubs}\n`)
                }
                else {
                // else, prepend the stubs
                    content = `${stubs}\n${content}`
                }

                await writeFile(outFile, content)
            })
        },
    } satisfies Plugin
}
