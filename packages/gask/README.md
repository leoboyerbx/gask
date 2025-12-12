# ⛽️ Gask

[![npm version](https://img.shields.io/npm/v/gask?color=blue)](https://www.npmjs.com/package/gask)

> **G**oogle **A**pps **S**cript **K**it.
> The modern ecosystem for GAS development.

**Gask** replaces the complex setup of Webpack/Rollup + Clasp with a single, opinionated, and robust CLI tool. It bridges the gap between the GAS ecosystem and modern web standards.

## ✨ Features

* ⚡️ **TS to GAS** - Compiles TypeScript into a format strictly compatible with the Google Apps Script online editor.
* 🎭 **Profile Management** - Handle multiple environments (Dev, Prod, Staging) easily.
* 🔒 **Smart Env Injection** - Securely injects environment variables based on a prefix (`GAS_API_KEY` → `env.API_KEY`).
* 📘 **Auto-Typing** - Automatically generates `.d.ts` declaration files for your injected environment variables.
* 👻 **Ghost Clasp** - Handles clasp config under-the-hood. No more pollution in your root folder.
* 🚀 **Zero Config** - Works out of the box for simple builds.


## 🚀 Getting Started

### 🌱 Create a new Gask project

You can use the `create-gask` package to scaffold a new Gask project quickly:
```bash
npm create gask my-gask-project
```
Then follow the prompts to get started. For more info see [create-gask](https://www.npmjs.com/package/create-gask).

### 🔌 Install in an existing project

```bash
# Install Gask
npm install -D gask

# Install GAS types (highly recommended)
npm install -D @types/google-apps-script
```


## 🛠️ Usage

### Zero Config (Local Build)

By default, Gask looks for `src/index.ts` and compiles it to `dist/`.

```bash
npx gask build
```

### With Configuration (Deployment)

To enable deployment capabilities and advanced features, create a `gask.config.ts`.

#### 1. Configure Profiles
```typescript
import { defineConfig } from 'gask'

export default defineConfig({
    entryFile: 'src/main.ts',

    // Define your environments here
    claspProfiles: {
        dev: {
            scriptId: '1B7x-your-dev-script-id...'
        },
        prod: {
            scriptId: '1A9z-your-prod-script-id...'
        }
    },

    // Environment variables security
    envPrefix: 'GAS_',
    envDeclarationPath: 'src/env.d.ts'
})
```


#### 2. Authenticate
Manage your Google session directly via Gask:

```bash
npx gask auth login
```

#### 3. Pull manifest

To start working, it's recommened to get the existing manifest from your GAS project:

```bash
npx gask manifest pull
# Or for a specific profile
npx gask manifest pull --profile=prod
```

> [!NOTE]
> This will create an `appsscript.json` file where your manifest is expected (default: `appsscript.json` next to your entry file).

#### 4. Deploy
Push to your configured profiles using the CLI.

```bash
# Push to the first profile defined (e.g., 'dev')
npx gask build --push

# Push to a specific profile
npx gask build --push=prod
```

### Dev Mode

Watch your files and deploy automatically on change.

```bash
npx gask dev

# And with auto push after each build
npx gask dev --push
```

## 🔐 Environment Variables

Gask offers a secure way to inject variables at build time.

1.  **Config**: Set `envPrefix: 'GAS_'` in `gask.config.ts`.
2.  **Define**: Add `GAS_API_KEY=123` in your `.env`.
3.  **Use**: Access it via `env.API_KEY` in your code (prefix is stripped).

> [!NOTE]
> To avoid leaking any env variables, omitting prefix will disable env injection.

## ⚙️ Configuration Reference

The `defineConfig` helper accepts a partial `GaskConfig`:

| Option | Type | Default | Description |
| :---- | :---- | :---- | :---- |
| **entryFile** | `string` | `'src/index.ts'` | Entry file path (relative to root). |
| **outDir** | `string` | `'dist'` | Output directory path. |
| **manifestPath** | `string` | `'[entryFile's dir]/appsscript.json'` | Path to the GAS manifest file. |
| **watchPaths** | `string[]` | `[entryFile's dir]` | Additional paths to watch in dev mode. |
| **repoUrl** | `string` | `undefined` | Optional repo URL added as a comment in the build output. |
| **claspProfiles** | `Record` | `undefined` | Dictionary of deployment targets (dev, prod...). |
| **envPrefix** | `string` | `undefined` | Prefix for env variables injection. |
| **envDeclarationPath** | `string` | `undefined` | Path to output the generated TypeScript declaration file. |

## 📄 License

MIT
    