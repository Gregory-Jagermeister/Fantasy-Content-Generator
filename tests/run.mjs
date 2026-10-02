// Bundle the tests with esbuild (no test library needed), then run them with Node's test runner.
import esbuild from "esbuild";
import { readdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const entries = readdirSync("tests").filter((f) => f.endsWith(".test.ts")).map((f) => `tests/${f}`);
rmSync("tests/build", { recursive: true, force: true });
await esbuild.build({
	entryPoints: entries,
	bundle: true,
	platform: "node",
	format: "cjs",
	outdir: "tests/build",
	external: ["obsidian"],
	logLevel: "warning",
});
const files = entries.map((e) => e.replace(/^tests\//, "tests/build/").replace(/\.ts$/, ".js"));
const run = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exit(run.status ?? 1);
