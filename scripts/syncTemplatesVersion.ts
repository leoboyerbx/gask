import { readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import nanoSpawn from 'nano-spawn'

console.log('Syncing gask version to templates...')

const templates = await readdir('./templates')

for (const template of templates) {
    const packageJsonPath = resolve(process.cwd(), `templates/${template}/package.json`)
    const { default: packageJson } = await import(packageJsonPath, {
        with: {
            type: 'json',
        },
    })
    packageJson.devDependencies.gask = `^${process.env.npm_package_version}`
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
    await nanoSpawn('git', ['add', packageJsonPath])
    console.log(`- Updated ${template} to version ${packageJson.devDependencies.gask}`)
}
