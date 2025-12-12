import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: ['src/index'],
    clean: true,
    rollup: {
        inlineDependencies: true, // To make the package standalone
        esbuild: {
            minify: true,
        },
        emitCJS: true,
    },

})
