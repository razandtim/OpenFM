# 📦 Release Guide

## Release Checklist

### Pre-Release

- [ ] All tests passing
- [ ] No linter errors
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers bumped
- [ ] Build tested locally

### Version Bump

Update version in these files:

1. `package.json` (root)
2. `apps/desktop/package.json`
3. `apps/desktop/src-tauri/tauri.conf.json`
4. `apps/desktop/src-tauri/Cargo.toml`
5. `apps/service/package.json`

```bash
# Example: Bump to v0.2.0
# Update all files above to version 0.2.0
```

### Create Release

```bash
# Commit version bump
git add .
git commit -m "chore: release v0.2.0"

# Create and push tag
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

### GitHub Actions

The workflow automatically:
1. Builds all platforms
2. Runs tests and linters
3. Creates release on GitHub
4. Uploads all artifacts

### Post-Release

- [ ] Verify all artifacts uploaded
- [ ] Test downloads on each platform
- [ ] Update release notes
- [ ] Announce on social media
- [ ] Update documentation site

---

## Release Artifacts

### Desktop App

| Platform | Format | Size (approx) |
|----------|--------|---------------|
| Windows | MSI | ~15-20 MB |
| Windows | NSIS | ~15-20 MB |
| macOS (Intel) | DMG | ~20-25 MB |
| macOS (ARM) | DMG | ~20-25 MB |
| Linux | DEB | ~15-20 MB |
| Linux | AppImage | ~25-30 MB |

### OBS Plugin

| Platform | Format | Size (approx) |
|----------|--------|---------------|
| Windows | ZIP | ~2-3 MB |
| macOS | ZIP | ~2-3 MB |

### Service

| Platform | Format | Size (approx) |
|----------|--------|---------------|
| All | TAR.GZ | ~5-10 MB |

---

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

Example:
- `v0.1.0` → `v0.2.0` (new features)
- `v0.2.0` → `v0.2.1` (bug fixes)
- `v0.2.1` → `v1.0.0` (breaking changes)

---

## Beta/RC Releases

For pre-releases:

```bash
git tag v0.2.0-beta.1
git push origin v0.2.0-beta.1
```

Mark as "pre-release" on GitHub.

---

## Hotfix Process

1. Create hotfix branch from main
2. Fix issue
3. Bump patch version
4. Tag and release
5. Merge back to main

```bash
git checkout -b hotfix/v0.2.1 main
# Fix bug
git commit -m "fix: critical bug"
git tag v0.2.1
git push origin v0.2.1
git checkout main
git merge hotfix/v0.2.1
```

