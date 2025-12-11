# ⛽️ @gask/cli

[![npm version](https://img.shields.io/npm/v/@gask/cli?color=blue)](https://www.npmjs.com/package/@gask/cli)

> **Core Engine** for the Gask CLI.

**Note:** This package contains the core logic for Gask. For normal usage, you should install the main package:

```bash
npm install -D gask
```

See [Gask Documentation](https://www.npmjs.com/package/gask) for full usage instructions.

## 📦 For Contributors / Advanced Users

This package exports the CLI binary and the core logic used by the proxy package.

### Direct Usage

```bash
npx @gask/cli build
```

### Programmatic Usage

```typescript
import { defineConfig } from '@gask/cli';
// or
import { runMainCommand } from '@gask/cli/run'
```

## 📄 License

MIT
