# Contributing to OpenFM

Thank you for your interest in contributing to OpenFM! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Search existing issues before creating a new one
- Include detailed information:
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots/logs if applicable
  - Environment (OS, Node version, OBS version)

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/openfm.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make your changes**
   - Follow the code style (see below)
   - Add tests if applicable
   - Update documentation

4. **Run checks**
   ```bash
   pnpm run lint
   pnpm run typecheck
   pnpm run test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add my feature"
   ```
   
   Use conventional commit format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Tests
   - `chore:` - Maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

7. **Open a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots if UI changes

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Rust (for desktop app)
- CMake and Qt 6 (for OBS plugin)
- OBS Studio dev files (for plugin)

### Installation
```bash
# Clone the repo
git clone https://github.com/openfm/openfm.git
cd openfm

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Start service
pnpm run service
```

## Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint rules (`.eslintrc.json`)
- Use Prettier for formatting (`.prettierrc`)
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public APIs

### React Components
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for props
- Export named components
- Keep components focused and small

### C++ (OBS Plugin)
- Follow C++17 standards
- Use RAII for resource management
- Prefer smart pointers
- Add comments for complex logic
- Use Qt naming conventions for Qt code

### Rust (Desktop App)
- Follow Rust conventions
- Use `cargo fmt` and `cargo clippy`
- Handle errors properly
- Write idiomatic Rust code

## Project Structure

```
openfm/
├── packages/        # Shared libraries
├── apps/           # Applications
├── tools/          # Development tools
├── installers/     # Installer scripts
├── docs/           # Documentation
└── sample-mood-packs/  # Sample music
```

See `docs/PROJECT_STRUCTURE.md` for details.

## Testing

### Unit Tests
```bash
pnpm run test
```

### Integration Tests
- Test OBS plugin in actual OBS Studio
- Test desktop app on Windows and macOS
- Test service API endpoints

### Manual Testing
- Follow acceptance tests in `docs/IMPLEMENTATION_SUMMARY.md`
- Test all 5 moods
- Test crossfade at different durations
- Test audio ducking in OBS
- Test Suno integration with API key

## Auto-Push

The project includes an auto-push tool that commits every 10 file changes:

```bash
pnpm run autopush
```

This is **optional** and mainly for rapid development. For production contributions, make meaningful commits manually.

## Documentation

- Update README.md for user-facing changes
- Update docs/ for technical changes
- Add JSDoc/TSDoc comments for new APIs
- Include examples in documentation

## Review Process

1. Maintainers review PRs within 7 days
2. Address feedback and update PR
3. Once approved, maintainer will merge
4. Your contribution will be credited in CHANGELOG.md

## Questions?

- Open a Discussion on GitHub
- Comment on related issues
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OpenFM! 🎵

