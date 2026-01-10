---
name: try to replace tool chains
description: Replace npm/ESLint/Prettier with Bun/Biome to align with Turnstile project toolchain
status: Done
current_phase: 6
verify_cmd: npm run fix && npm run check && npm run build
impl_progress:
  phase_1: pending
  phase_2: pending
  phase_3: pending
  phase_4: pending
  phase_5: pending
  phase_6: pending
created_at: 2026-01-08 23:16:13
updated_at: 2026-01-09 22:14:53
---

## try to replace tool chains

### Background

Next tasks is to replace the build tool chains align with project turnstile. Current tools are:

- Node.js 18+
- npm
- Astro 5.0+
- eslint + prettier

The tools for project turnstile are:

- Bun
- Astro 5.0+
- biomejs/biome
- vite/vitest optional

### Requirements / Objectives

**Primary Goals:**
- Replace npm with Bun for package management (performance + consistency)
- Replace ESLint + Prettier with Biome (unified tooling + performance)
- Ensure GitHub Actions CI/CD continues working
- Maintain smooth transition with big-bang approach

**Secondary Goals:**
- Comprehensive file review and cleanup (remove Docker, nginx, and other unnecessary files)
- Update all documentation to reflect new toolchain
- Ensure developer onboarding reflects new tools

**Success Criteria:**
- ✅ Project builds successfully with Bun
- ✅ All linting/formatting works with Biome
- ✅ GitHub Actions CI/CD passes
- ✅ Local development works identically to before
- ✅ Unnecessary files removed
- ✅ Documentation updated

### Solutions / Goals

#### Architecture Overview

**Current Toolchain:**
```
npm (package management)
  ├─ install: npm ci
  ├─ scripts: npm run *
  └─ cache: npm cache

ESLint + Prettier (code quality)
  ├─ lint: eslint .
  ├─ format: prettier -w .
  └─ config: eslint.config.js, .prettierrc.cjs

GitHub Actions (CI/CD)
  ├─ Node.js 18/20/22 matrix
  ├─ setup-node@v4
  └─ cache: npm
```

**Target Toolchain:**
```
Bun (package management + runtime)
  ├─ install: bun install
  ├─ scripts: bun run *
  └─ cache: bun cache (automatic)

Biome (unified code quality)
  ├─ lint: biome check .
  ├─ format: biome check --write .
  └─ config: biome.json

GitHub Actions (CI/CD)
  ├─ Bun setup (official action)
  ├─ Single version (latest)
  └─ cache: bun (automatic)
```

**Migration Strategy: Big-Bang**
- Replace everything at once
- Single commit for all toolchain changes
- Simpler rollback if needed (revert one commit)

#### Core Components

**1. Bun Integration**
- **Purpose**: Package manager and runtime replacement for npm/Node.js
- **Benefits**: 10-100x faster installs, built-in TypeScript, smaller disk footprint
- **Compatibility**: Full npm compatibility, drop-in replacement
- **Changes**:
  - Add `bun.lockb` (Bun's lockfile)
  - Keep `package.json` (Bun reads it)
  - Update scripts to use `bun run` (optional, `npm run` still works)
  - Remove `package-lock.json` after Bun generates lockfile

**2. Biome Integration**
- **Purpose**: Unified linter and formatter replacement for ESLint + Prettier
- **Benefits**: 10-100x faster, single config, better formatting
- **Compatibility**: ESLint/Prettier rule migration, VS Code extension
- **Changes**:
  - Create `biome.json` (migrated from ESLint/Prettier configs)
  - Update scripts to use `biome check` instead of `eslint`/`prettier`
  - Remove `eslint.config.js`, `.prettierrc.cjs`, `.prettierignore`
  - Migrate ESLint rules to Biome equivalents

**3. GitHub Actions Updates**
- **Purpose**: CI/CD pipeline compatibility with Bun
- **Changes**:
  - Replace `actions/setup-node@v4` with `oven-sh/setup-bun@v2`
  - Remove Node.js version matrix (Bun version-stable)
  - Update `npm ci` → `bun install`
  - Update `npm run *` → `bun run *`
  - Update cache strategy (Bun's built-in caching)

**4. File Cleanup**
- **Purpose**: Remove unnecessary files from project root
- **Files to Remove**:
  - `Dockerfile` - Not used (Astro static site, no Docker deployment)
  - `nginx/` directory - Not used (Cloudflare Pages hosts directly)
  - `.npmrc` - Not needed with Bun
  - `package-lock.json` - Replaced by `bun.lockb`
  - `.stackblitzrc` - Unused StackBlitz config
  - `.DS_Store` files - Should be in .gitignore
  - `eslint.config.js` - Replaced by Biome
  - `.prettierrc.cjs` - Replaced by Biome
  - `.prettierignore` - Replaced by Biome's ignore patterns

#### Data Model

**Biome Configuration Structure:**
```json
{
  "$schema": "https://biomejs.org/schemas/1.9.3/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      ".astro/",
      "dist/",
      "node_modules/",
      "turnstile_src/",
      ".git/"
    ]
  },
  "formatter": {
    "indentWidth": 2,
    "indentStyle": "tab",
    "lineWidth": 100,
    "ignore": ["astro.config.ts"]
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "warn",
        "useExhaustiveDependencies": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "noConsole": "warn",
        "useConst": "error",
        "noParameterAssign": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always"
    }
  }
}
```

#### Key Implementation Details

**Phase Order:**
1. **Preparation** - Backup current state, create migration branch
2. **Biome Setup** - Install Biome, create config, migrate rules
3. **Bun Setup** - Install Bun globally, generate lockfile, test scripts
4. **CI/CD Update** - Update GitHub Actions workflows
5. **Cleanup** - Remove unnecessary files and old configs
6. **Verification** - Run full build, test, and CI/CD validation

**Error Handling:**
- If Biome migration fails: Fix rules in `biome.json` incrementally
- If Bun install fails: Clear `node_modules` and `bun.lockb`, retry
- If CI/CD fails: Check GitHub Actions logs, adjust Bun version pin
- Rollback plan: Single revert commit to return to npm/ESLint/Prettier

**Configuration Migration:**
- ESLint rules → Biome rules (see mapping table)
- Prettier config → Biome formatter config
- `.prettierignore` → Biome `files.ignore`
- Astro-specific rules preserved in Biome overrides

#### Edge Cases Handled

**1. Astro + Bun Compatibility**
- **Issue**: Astro officially supports Node.js, not Bun
- **Solution**: Use Bun in Node.js compatibility mode (works seamlessly)
- **Reference**: [Using Bun with Astro](https://docs.astro.build/en/guides/recipes/bun/)

**2. TypeScript Path Aliases**
- **Issue**: Biome may not understand Astro's `~/*` aliases
- **Solution**: Add TypeScript project references or configure Biome's paths
- **Alternative**: Use `biome check --javascript-enabled=false` for TS files

**3. Astro Components (.astro files)**
- **Issue**: Biome may not parse `.astro` files correctly
- **Solution**: Exclude `.astro` from Biome, rely on Astro's own linting
- **Config**: Add `"*.astro"` to `files.ignore`

**4. GitHub Actions Cache Key**
- **Issue**: Cache keys based on Node.js version no longer valid
- **Solution**: Use Bun's version or simple hash of lockfile
- **Config**: `key: ${{ runner.os }}-bun-${{ hashFiles('bun.lockb') }}`

**5. Environment Variables in CI/CD**
- **Issue**: Bun may handle env vars differently than npm
- **Solution**: All env vars already defined in GitHub Actions, Bun inherits them
- **Verification**: Test build with all required env vars

#### Implementation Plan

##### Phase 1: Preparation & Backup [Complexity: Low]

**Goal**: Ensure safe rollback point before migration

**Status**: pending

- [ ] Create backup branch: `git branch backup-before-toolchain-migration`
- [ ] Commit current working state: `git commit -am "Backup before toolchain migration"`
- [ ] Document current npm/Node.js versions
- [ ] Document current ESLint/Prettier configurations
- [ ] Verify all tests pass: `npm run check && npm run build`

**Deliverable**: Clean git history with rollback point
**Dependencies**: None

---

##### Phase 2: Biome Installation & Configuration [Complexity: Medium]

**Goal**: Replace ESLint + Prettier with Biome

**Status**: pending

- [ ] Install Biome as dev dependency: `bun add -D @biomejs/biome`
- [ ] Create `biome.json` configuration file
- [ ] Migrate ESLint rules to Biome equivalents:
  - `eslint-plugin-astro` → Biome's astro support
  - TypeScript rules → Biome's recommended rules
  - Custom rules → Biome rule overrides
- [ ] Update package.json scripts:
  ```json
  "check": "bun run check:astro && bun run check:biome",
  "check:astro": "astro check",
  "check:biome": "biome check .",
  "fix": "bun run fix:biome",
  "fix:biome": "biome check --write ."
  ```
- [ ] Remove old linting configs: `rm eslint.config.js .prettierrc.cjs .prettierignore`
- [ ] Remove old dev dependencies: `bun remove eslint prettier eslint-plugin-astro @typescript-eslint/*`
- [ ] Run Biome to format all files: `bun run fix:biome`
- [ ] Verify no regressions: `bun run check`

**Deliverable**: Biome fully configured and tested
**Dependencies**: Phase 1

---

##### Phase 3: Bun Installation & Lockfile [Complexity: Low]

**Goal**: Replace npm with Bun for package management

**Status**: pending

- [ ] Install Bun globally (local machine): `curl -fsSL https://bun.sh/install | bash`
- [ ] Verify Bun installation: `bun --version`
- [ ] Install Bun in project (generate lockfile): `bun install`
- [ ] Review `bun.lockb` to ensure all dependencies resolved correctly
- [ ] Remove old lockfile: `rm package-lock.json`
- [ ] Update `package.json` scripts to use `bun run` (optional but recommended):
  ```json
  "dev": "bun run dev",
  "build": "bun run build",
  "check": "bun run check:astro && bun run check:biome",
  "fix": "bun run fix:biome"
  ```
- [ ] Test all scripts work: `bun run dev`, `bun run build`, `bun run check`
- [ ] Verify install from fresh: `rm -rf node_modules bun.lockb && bun install`

**Deliverable**: Bun fully functional as package manager
**Dependencies**: Phase 2

---

##### Phase 4: GitHub Actions CI/CD Migration [Complexity: Medium]

**Goal**: Update CI/CD pipeline to use Bun

**Status**: pending

- [ ] Update `.github/workflows/actions.yaml`:
  ```yaml
  - uses: actions/checkout@v4
  - name: Use Bun
    uses: oven-sh/setup-bun@v2
    with:
      bun-version: latest
  - name: Cache Bun
    uses: actions/cache@v4
    with:
      path: ~/.bun/install/cache
      key: ${{ runner.os }}-bun-${{ hashFiles('bun.lockb') }}
      restore-keys: |
        ${{ runner.os }}-bun-
  - run: bun install --frozen-lockfile
  - run: bun run build
  ```
- [ ] Remove Node.js version matrix (no longer needed)
- [ ] Update `.github/workflows/deploy.yml` similarly
- [ ] Test CI/CD by pushing to feature branch
- [ ] Verify build succeeds in GitHub Actions
- [ ] Verify all environment variables pass through correctly

**Deliverable**: GitHub Actions using Bun successfully
**Dependencies**: Phases 1, 2, 3

---

##### Phase 5: File Cleanup & Documentation [Complexity: Low]

**Goal**: Remove unnecessary files and update documentation

**Status**: pending

- [ ] Remove Docker-related files:
  - `rm Dockerfile`
  - `rm -rf nginx/`
- [ ] Remove npm-related configs:
  - `rm .npmrc`
  - `rm package-lock.json` (if not already removed)
- [ ] Remove old linting configs:
  - `rm eslint.config.js`
  - `rm .prettierrc.cjs`
  - `rm .prettierignore`
- [ ] Remove unused files:
  - `rm .stackblitzrc`
  - Find and remove `.DS_Store` files: `find . -name '.DS_Store' -delete`
- [ ] Update `.gitignore`:
  - Add `.DS_Store`
  - Add `bun.lockb` (if not present)
  - Remove `package-lock.json` (if present)
  - Update comments to reflect Bun/Biome instead of npm/ESLint
- [ ] Update `CLAUDE.md` documentation:
  - Change npm → Bun references
  - Change ESLint/Prettier → Biome references
  - Update installation instructions
  - Update development commands
- [ ] Update `README.md` (if exists) with new toolchain info
- [ ] Update `.vscode/settings.json` (if exists) to recommend Biome extension
- [ ] Create migration guide in `docs/` for future reference

**Deliverable**: Clean codebase with updated documentation
**Dependencies**: Phases 1, 2, 3, 4

---

##### Phase 6: Verification & Rollback Planning [Complexity: Medium]

**Goal**: Complete testing and prepare for production

**Status**: pending

- [ ] Run full verification: `bun run fix && bun run check && bun run build`
- [ ] Test local development server: `bun run dev`
- [ ] Test production preview: `bun run build && bun run preview`
- [ ] Test all package scripts still work
- [ ] Verify CI/CD passes on GitHub Actions
- [ ] Test on clean machine (if available): Clone repo, `bun install`, `bun run build`
- [ ] Create rollback commit message: "Revert: Replace npm/ESLint/Prettier with Bun/Biome"
- [ ] Document rollback procedure:
  ```bash
  # If migration fails, revert to backup:
  git revert HEAD
  git push origin main
  ```
- [ ] Update task status: Set to `Testing` after verification passes
- [ ] Create summary document of changes made

**Deliverable**: Fully verified toolchain migration ready for production
**Dependencies**: All previous phases

### References

- [Using Bun with Astro and Cloudflare Pages](https://handerson.hashnode.dev/using-bun-with-astro-and-cloudflare-pages)
- [Bun Documentation](https://bun.sh/docs)
- [Biome Documentation](https://biomejs.dev/)
- [GitHub Actions: Official Bun Action](https://github.com/oven-sh/setup-bun)
- [Astro: Bun Guide](https://docs.astro.build/en/guides/recipes/bun/)
