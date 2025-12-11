import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        'src/index',
        'src/run',
        'src/cli',
    ],
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: true,
    },
})
