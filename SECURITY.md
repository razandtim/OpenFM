# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in OpenFM, please report it responsibly:

1. **Do NOT** open a public issue
2. Email security concerns to: security@openfm.example.com (replace with actual email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Best Practices

### API Keys
- Never commit API keys to the repository
- Use environment variables or secure storage
- OpenFM stores keys using:
  - **Windows**: DPAPI (Data Protection API)
  - **macOS**: Keychain Access

### Network Security
- Service runs on localhost only (127.0.0.1)
- No external network access required
- WebSocket connections are same-origin only

### Authentication
- Supabase handles authentication
- JWT tokens stored securely
- Never logged or exposed in error messages

### Updates
- Keep dependencies up to date
- Run `pnpm update` regularly
- Check for security advisories

## Known Security Considerations

### Local Service
The OpenFM service runs on `http://127.0.0.1:6767` without authentication. This is acceptable because:
- Only accessible from localhost
- Not exposed to network
- Client applications connect locally

If you need to expose the service over network, implement proper authentication.

### OBS Plugin
The OBS plugin loads web content from the local service. Ensure:
- Service is only running trusted code
- No user-generated content is executed
- WebView has restricted permissions

## Security Updates

Security updates will be published as patch releases and announced via:
- GitHub Security Advisories
- CHANGELOG.md
- Release notes

## Responsible Disclosure

We appreciate security researchers who:
- Report vulnerabilities responsibly
- Give us time to fix issues before disclosure
- Work with us to understand and resolve the issue

Researchers who follow this process will be credited (with permission) in:
- CHANGELOG.md
- Security advisories
- Release notes

---

**Last Updated**: 2024-11-09

