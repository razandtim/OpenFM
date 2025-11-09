#!/usr/bin/env node
/* Auto-push whenever 10 files are changed (added/edited/deleted). */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const THRESHOLD = parseInt(process.env.OPENFM_AUTOPUSH_THRESHOLD || "10", 10);
const DISABLE = process.env.OPENFM_AUTOPUSH === "0";
const ROOT = process.cwd();
const IGNORE = new Set();
const IGNOREFILES = [".gitignore", ".autopushignore"];

if (DISABLE) {
  console.log("Auto-push disabled (OPENFM_AUTOPUSH=0).");
  process.exit(0);
}

function loadIgnore() {
  for (const f of IGNOREFILES) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      fs.readFileSync(p, "utf8")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => IGNORE.add(line));
    }
  }
}

loadIgnore();

function isIgnored(filepath) {
  const rel = filepath.replace(/\\/g, "/");
  for (const pat of IGNORE) {
    if (pat.endsWith("/**")) {
      const base = pat.slice(0, -3);
      if (rel.startsWith(base)) return true;
    }
    if (pat.endsWith("*")) {
      const base = pat.slice(0, -1);
      if (rel.startsWith(base)) return true;
    }
    if (rel === pat) return true;
  }
  return false;
}

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
}

function changedFiles() {
  // Unstaged + staged changes since HEAD.
  const names = new Set();
  const add = (out) =>
    out
      .split(/\r?\n/)
      .filter(Boolean)
      .map((l) => l.replace(/^R\d+\s+/, "").split("\t").pop()) // handle renames "R100 src a\tb"
      .filter((f) => f && !isIgnored(f))
      .forEach((f) => names.add(f));

  try {
    add(git("status --porcelain"));
  } catch {}
  return Array.from(names);
}

function run(cmd) {
  const [bin, ...args] = cmd.split(" ");
  const res = spawnSync(bin, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) throw new Error(`${cmd} failed`);
}

function main() {
  console.log(
    `Auto-push running (threshold=${THRESHOLD}). Press Ctrl-C to stop.`
  );
  let lastCount = 0;

  const tick = () => {
    try {
      const files = changedFiles();
      const count = files.length;

      if (count !== lastCount) {
        process.stdout.write(`\rChanged files: ${count}   `);
        lastCount = count;
      }

      if (count >= THRESHOLD) {
        console.log(`\nThreshold reached (${count}). Running checks...`);
        
        // Run checks
        try {
          run("pnpm -w run lint");
        } catch (e) {
          console.warn("Lint failed, skipping auto-push");
          return;
        }
        
        try {
          run("pnpm -w run typecheck");
        } catch (e) {
          console.warn("Typecheck failed, skipping auto-push");
          return;
        }

        console.log("Staging files...");
        run("git add -A");

        const ts = new Date().toISOString().replace(/\..+/, "");
        const msg = `chore(auto): batch push (${count} files) ${ts} [auto]`;
        
        try {
          run(`git commit -m "${msg}"`);
        } catch (e) {
          console.log("Nothing to commit or commit failed");
          return;
        }

        console.log("Pushing...");
        try {
          run("git push");
          console.log("✓ Auto-push completed. Resetting counter.");
        } catch (e) {
          console.error("Push failed:", e.message);
        }
      }
    } catch (e) {
      console.error("\nAuto-push error:", e.message);
    } finally {
      setTimeout(tick, 2000); // poll every 2s; simple & robust
    }
  };

  tick();
}

main();

