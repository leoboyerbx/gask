# ⛽️ Gask

> **G**oogle **A**pps **S**cript **K**it.
> The modern ecosystem for GAS development.

Gask is a collection of high-performance tools designed to bring a modern Developer Experience (DX) to Google Apps Script.

## 📦 Packages

| Package | Description | Version |
| --- | --- | --- |
| **[`gask`](./packages/gask)** | **The Main Package.** The one you want to install. Includes the CLI useful exports. | [![npm](https://img.shields.io/npm/v/gask)](https://www.npmjs.com/package/gask) |
| [`@gask/cli`](./packages/cli) | The core engine. Compiles TypeScript, manages .env, and handles deployment. | [![npm](https://img.shields.io/npm/v/@gask/cli)](https://www.npmjs.com/package/@gask/cli) |
| `@gask/ui` | UI helpers to build sidebars and modals effortlessly. | 🚧 _Coming Soon_ |
| `@gask/utils` | Type-safe wrappers and local mocks for Google Services. | 🚧 _Coming Soon_ |

## 🌟 Philosophy

- **TypeScript First**: Everything is typed. From your configuration to your runtime code.
- **Ghost Config**: We don't pollute your project root. Temporary configs (like `.clasp.json`) are generated on the fly and cleaned up instantly.
- **Modern Stack**: Built on top of `esbuild` and the unjs ecosystem for blazing fast performance.

## 🤝 Contributing

This project is a monorepo managed with pnpm.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## 📄 License
MIT
    