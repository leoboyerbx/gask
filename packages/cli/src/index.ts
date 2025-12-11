export interface ClaspProfile {
    scriptId: string
}

export interface GaskConfig {
    /**
     * Entry file path (relative to project root)
     * @default 'src/index.ts'
     */
    entryFile: string
    /**
     * Optional list of additional paths to watch for changes in dev mode (relative to project root)
     * @default Entry file directory
     * @example ['src/utils', 'src/lib']
     */
    watchPaths: string[]
    /**
     * Output directory path (relative to project root)
     * @default 'dist'
     */
    outDir: string
    /**
     * Path to the manifest file (relative to project root)
     * @default "[entryFile's directory]/appsscript.json"
     */
    manifestPath: string
    /**
     * Clasp profiles configuration.
     * @example
     * {
     *   "dev": { "scriptId": "your-dev-script-id" },
     *   "prod": { "scriptId": "your-prod-script-id" }
     * }
     */
    claspProfiles?: Record<string, ClaspProfile>
    /**
     * Prefix for env variables. If set, all **build-time** env variables starting with this prefix will be statically injected in the build.
     * To use the env vars in the code, use env.YOUR_VAR_NAME (without the prefix). Ex: GAS_API_KEY will become env.API_KEY.
     * See envDeclarationPath to generate the corresponding TypeScript declarations.
     *
     * When building, Gask loads env variables from a `.env` file at the project root using `dotenv`.
     */
    envPrefix?: string
    /**
     * The path where to output the generated `env.d.ts` declaration file (relative to project root).
     * This allows TypeScript to recognize the injected env variables.
     */
    envDeclarationPath?: string
    /**
     * Optional repository URL to be added at the start of the build JS.
     * @example 'https://github.com/your/repo'
     */
    repoUrl?: string
}

export function defineConfig(config: Partial<GaskConfig>) {
    return config
}
