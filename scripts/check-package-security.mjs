import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const dependencySections = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
const exactSemver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const npmrcKeysMovedToWorkspace = new Set([
  "ignore-scripts",
  "minimum-release-age",
  "min-release-age",
  "save-exact",
  "lockfile",
]);

const errors = [];

if (existsSync(".npmrc")) {
  for (const rawLine of readFileSync(".npmrc", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;

    const sep = line.indexOf("=");
    if (sep === -1) continue;

    const key = line.slice(0, sep).trim();
    if (npmrcKeysMovedToWorkspace.has(key)) {
      report(`.npmrc: ${key}=… should be moved to pnpm-workspace.yaml (pnpm 11).`);
    }
  }
}

const pnpmConfig = JSON.parse(
  execFileSync("pnpm", ["config", "list", "--json", "--location", "project"], {
    encoding: "utf8",
  })
);

if (!pnpmConfig.allowBuilds) {
  report("pnpm-workspace.yaml must set allowBuilds.");
}

for (const [key, expected] of Object.entries({
  minimumReleaseAge: 10080,
  minimumReleaseAgeStrict: true,
  saveExact: true,
  lockfile: true,
})) {
  if (pnpmConfig[key] !== expected) {
    report(`pnpm-workspace.yaml: ${key} must be ${expected}, got ${pnpmConfig[key] ?? "unset"}.`);
  }
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (!/^pnpm@\d+\./.test(packageJson.packageManager ?? "")) {
  report("package.json must pin packageManager to pnpm.");
}

if (!existsSync("pnpm-lock.yaml")) {
  report("pnpm-lock.yaml must exist.");
} else {
  const lockRaw = readFileSync("pnpm-lock.yaml", "utf8");
  if (!lockRaw.includes("lockfileVersion:")) {
    report("pnpm-lock.yaml is not a valid pnpm lockfile.");
  }
}

for (const section of dependencySections) {
  const deps = packageJson[section] ?? {};
  for (const [name, spec] of Object.entries(deps)) {
    if (spec === "workspace:*") continue;

    if (!exactSemver.test(spec)) {
      report(`${section}.${name} must use an exact semver version.`);
    }
  }
}

if (errors.length > 0) {
  console.error("Package security policy check failed:");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log("Package security policy check passed.");

function report(message) {
  errors.push(message);
}
