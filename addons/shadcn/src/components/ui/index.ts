// Every shadcn-vue primitive in this addon, re-exported so setup/main.ts can register them
// globally (slides use <Card>, <Badge>, <CodeBlock> ... without imports).
// `pnpm dlx shadcn-vue@latest add <name>` (run in addons/shadcn) adds a folder here; add a line below.
export * from "./alert"
export * from "./badge"
export * from "./button"
export * from "./card"
export * from "./code-block"
export * from "./item"
export * from "./kbd"
export * from "./marker"
export * from "./separator"
export * from "./table"
