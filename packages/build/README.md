# **⛽️ @gask/build**

A blazing fast TypeScript bundler and deployer for Google Apps Script.

**@gask/build** replaces the complex setup of Webpack/Rollup + Clasp with a single, opinionated, and robust CLI tool.

## **✨ Features**

* ⚡️ **TS to GAS** - Compiles TypeScript into a format strictly compatible with the Google Apps Script online editor.
* 🎭 **Profile Management** - Handle multiple environments (Dev, Prod, Staging) easily with claspProfiles.
* 🔒 **Smart Env Injection** - Securely injects environment variables based on a prefix (e.g., GAS_API_KEY → env.API_KEY).
* 📘 **Auto-Typing** - Automatically generates .d.ts declaration files for your injected environment variables.
* 👻 **Ghost Clasp** - Handles clasp config under-the-hood.
* 🚀 **Zero Config** - Works out of the box for simple builds.

## **📦 Installation**

```bash
# Install the build package
npm install -D @gask/build

# Install GAS types (highly recommended)
npm install -D @types/google-apps-script
```

## **🚀 Usage**

### **Zero Config (Local Build)**

By default, Gask looks for `src/index.ts`, `src/appsscript.json` and compiles it to `dist/`. No config needed.
```bash
npx gask build
```

### **With Configuration (Deployment)**

To enable deployment capabilities and advanced features, create a `gask.config.ts`.

#### **1. Configure Profiles**
```typescript
import { defineConfig } from '@gask/build'

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

#### **2. Deploy**

Push to your configured profiles using the CLI.
```bash
# Push to the first profile defined (e.g., 'dev')
npx gask build --push

# Push to a specific profile
npx gask build --push=prod
```

### **Dev Mode**

Watch your files and deploy automatically on change.
```bash
npx gask dev

# And with auto push after each build
npx gask dev --push
```

## **🔐 Environment Variables**

Gask Build offers a secure way to inject variables at build time without exposing your entire system environment.

### **1. Setup**

In your gask.config.ts, set a prefix:
```typescript
export default defineConfig({
    envPrefix: 'GAS_', // Only variables starting with GAS_ will be injected
    envDeclarationPath: 'src/env.d.ts' // Optional: Generate Types!
})
```

> [!NOTE]
> To avoid leaking any env variables, omtting prefix will disable env injection.

### **2. Define**

In your .env file:
```bash
# Will be injected as env.API_KEY
GAS_API_KEY=secret_123

# Will be IGNORED
SYSTEM_PASSWORD=do_not_leak
```

### **3. Use in Code**

Gask exposes a global env object. Variables are mapped from `GAS_MY_VAR` to `env.MY_VAR` (prefix is stripped).

If you configured envDeclarationPath, you'll even get autocompletion!

```typescript
// No need for process.env
// The prefix 'GAS_' is stripped automatically
console.log(env.API_KEY)
```

## **⚙️ Configuration Reference**

The defineConfig helper accepts a partial GaskBuildConfig:

| Option | Type | Default | Description |
| :---- | :---- | :---- | :---- |
| **entryFile** | `string` | `'src/index.ts'` | Entry file path (relative to root). |
| **outDir** | `string` | `'dist'` | Output directory path. |
| **manifestPath** | `string` | `'src/appsscript.json'` | Path to the GAS manifest file. |
| **watchPaths** | `string[]` | `[entryFile's dir]` | Additional paths to watch in dev mode. |
| **repoUrl** | `string` | `undefined` | Optional repo URL added as a comment in the build output. |
| **claspProfiles** | `Record<string, { scriptId: string }>` | `undefined` | Dictionary of deployment targets (dev, prod...). |
| **envPrefix** | `string` | `undefined` | Prefix for env variables injection. |
| **envDeclarationPath** | `string` | `undefined` | Path to output the generated TypeScript declaration file. |

## **📟 CLI Arguments**

These arguments are usable with both the `build` and the `dev` commands.

| Flag | Alias | Usage | Description |
| :---- | :---- | :---- | :---- |
| `--push` | `-p` | `--push`<br>`--push=prod`<br>`--push prod`<br>`-p prod` | If present, pushes to the specified profile. If no value is given, uses the first profile found in config. |

## **📄 License**

MIT
