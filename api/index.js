// Vercel compiles files in api/ one by one without resolving the @shared/* aliases or adding
// the .js extensions Node's ESM loader requires, so the handler is pre-bundled by `pnpm build`.
export { default } from "../dist/vercel.js";
