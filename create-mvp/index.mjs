#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const packageName = "@andre.marinho/create-mvp";
const name = args[0];

if (!name || name === "--help" || name === "-h") {
  console.log(`
  create-mvp <project-name>

  Scaffolds a fresh copy of the saas-mvp monorepo in <project-name>/.

  Examples:
    npx ${packageName} my-app
    npx ${packageName} .
`);
  process.exit(name ? 0 : 1);
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.error) {
    console.error(`✕ Unable to run ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const target = name === "." ? process.cwd() : resolve(process.cwd(), name);

if (existsSync(target) && name !== ".") {
  console.error(`✕ ${name} already exists`);
  process.exit(1);
}

const repo = "andre-lmarinho/saas-mvp";

console.log(`\n  Scaffolding into ${target} …\n`);

run("npx", ["--yes", "degit", repo, ...(name === "." ? [] : [name])]);

// degit copies the whole repo, including this installer; the scaffold doesn't need it.
rmSync(resolve(target, "create-mvp"), { recursive: true, force: true });

console.log("  Installing dependencies …\n");

// assumes pnpm is on PATH; the monorepo requires it to run anyway.
run("pnpm", ["install"], { cwd: target });

const cdStep = name === "." ? "" : `    cd ${JSON.stringify(name)}\n`;

console.log(`\n  ✅ Done!
  ─────────────────────────────────────────────
${cdStep}    Copy apps/web/.env.example to apps/web/.env.local
    Copy apps/landing/.env.example to apps/landing/.env.local
    pnpm run dev
  ─────────────────────────────────────────────
`);
