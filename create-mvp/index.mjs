#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);

if (args[0] === "--help" || args[0] === "-h") {
  console.log(`
  create-mvp <project-name>

  Scaffolds a fresh copy of the saas-mvp monorepo in <project-name>/.

  Examples:
    npx create-mvp my-app
    npx create-mvp .
`);
  process.exit(0);
}

const name = args[0] || "my-mvp";
const target = name === "." ? process.cwd() : resolve(process.cwd(), name);

if (existsSync(target) && name !== ".") {
  console.error(`✕ ${name} already exists`);
  process.exit(1);
}

const repo = "andre-lmarinho/saas-mvp";

console.log(`\n  Scaffolding into ${target} …\n`);

const dest = name === "." ? "" : name;
execSync(`npx -y degit ${repo} ${dest}`.trimEnd(), { stdio: "inherit" });

console.log("  Installing dependencies …\n");

execSync("pnpm install", { stdio: "inherit", cwd: target });

console.log(`\n  ✅ Done!
  ─────────────────────────────────────────────
    cd ${name}
    cp apps/web/.env.example apps/web/.env.local
    cp apps/landing/.env.example apps/landing/.env.local
    pnpm run dev
  ─────────────────────────────────────────────
`);
