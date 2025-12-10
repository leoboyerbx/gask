# ⛽️ Gask

> **G**oogle **A**pps **S**cript **K**it. The modern ecosystem for GAS development.

Gask is a collection of high-performance tools designed to bring a modern Developer Experience (DX) to Google Apps Script. It bridges the gap between the GAS ecosystem and modern web standards.

## 📦 Packages

| Package | Description | Status |
| --- | --- | --- |
| [`@gask/build`](./packages/build) | The core CLI. Compiles TypeScript, manages .env, and handles deployment. | `beta` |
| `@gask/ui` (Coming Soon) | UI helpers to build sidebars and modals effortlessly. | 🚧 |
| `@gask/utils` (Coming Soon) | Type-safe wrappers and local mocks for Google Services. | 🚧 |

## 🌟 Philosophy

- TypeScript First: Everything is typed. From your configuration to your runtime code.
- Ghost Config: We don't pollute your project root. Temporary configs (like .clasp.json) are generated on the fly and cleaned up instantly.
- Modern Stack: Built on top of esbuild and the unjs ecosystem for blazing fast performance.

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