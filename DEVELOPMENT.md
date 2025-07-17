# Development Guide

This guide explains how to set up the development environment and contribute to Lorem Chatum.

## Development Setup

### Prerequisites

- Node.js 16 or newer
- npm (comes with Node.js)
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/twardoch/lorem-chatum-for-indesign.git
   cd lorem-chatum-for-indesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prepare the development environment**
   ```bash
   npm run prepare
   ```

## Project Structure

```
lorem-chatum-for-indesign/
├── src/
│   ├── v1-indesign-2022-and-older/    # Legacy ExtendScript version
│   │   ├── Lorem-Chatum-v1.jsx
│   │   └── LICENSE.txt
│   └── v2-indesign-2023-and-newer/    # Modern UXP version
│       ├── Lorem-Chatum-v2.idjs
│       ├── install-Mac.command
│       ├── install-Win.bat
│       └── LICENSE.txt
├── scripts/                           # Build and development scripts
│   ├── build.js                      # Main build script
│   ├── build-multiplatform.js        # Platform-specific builds
│   ├── build-artifacts.js            # Artifact generation
│   ├── version.js                    # Version management
│   ├── release.js                    # Release automation
│   ├── prepare.js                    # Dev environment setup
│   └── dev.js                        # Development utilities
├── test/                             # Test suite
│   ├── run-tests.js                  # Main test runner
│   └── integration-test.js           # Integration tests
├── .github/workflows/                # GitHub Actions
│   ├── ci.yml                        # Continuous Integration
│   ├── release.yml                   # Release automation
│   └── scheduled.yml                 # Scheduled maintenance
├── build/                            # Build output (gitignored)
├── dist/                             # Distribution files (gitignored)
├── package.json                      # Project configuration
├── README.md                         # Main documentation
├── INSTALLATION.md                   # Installation guide
├── DEVELOPMENT.md                    # This file
└── LICENSE.txt                       # License
```

## Available Scripts

### Testing
```bash
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:integration    # Run integration tests
```

### Building
```bash
npm run build              # Full build process
npm run build:multiplatform # Build platform-specific packages
npm run build:artifacts    # Generate release artifacts
```

### Development
```bash
npm run dev test           # Run tests
npm run dev build          # Build project
npm run dev version        # Check version
npm run dev clean          # Clean build artifacts
```

### Linting
```bash
npm run lint               # Check code style
npm run lint:fix           # Fix code style issues
```

### Versioning and Release
```bash
npm run version            # Update version in source files
npm run release 2.1.0      # Create and push release tag
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit source files in `src/`
   - Add tests if needed
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run test:integration
   ```

4. **Build and verify**
   ```bash
   npm run build
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a pull request**

### Testing

The project includes comprehensive testing:

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test the full build process
- **File validation**: Verify file structure and syntax
- **Package validation**: Check package.json and dependencies

Tests run automatically on:
- Every commit (via git hooks)
- Pull requests (via GitHub Actions)
- Scheduled maintenance (weekly)

### Building

The build process:

1. **Clean**: Remove old build artifacts
2. **Copy Source**: Copy source files to build directory
3. **Version**: Update version numbers in source files
4. **Package**: Create zip archives
5. **Installers**: Create platform-specific installers
6. **Multiplatform**: Build platform-specific packages
7. **Artifacts**: Generate metadata and release artifacts

### Versioning

The project uses semantic versioning (semver):
- `MAJOR.MINOR.PATCH` (e.g., 2.1.0)
- Version is managed through git tags
- Source files are automatically updated with version numbers

## Code Style

### JavaScript/ExtendScript
- Use ES6+ features for v2 (UXP)
- Use ES3 compatible code for v1 (ExtendScript)
- Follow existing code patterns
- Add comments for complex logic
- Use meaningful variable names

### File Headers
All source files should include:
```javascript
// this_file: relative/path/to/file.js
```

### Documentation
- Update README.md for user-facing changes
- Update INSTALLATION.md for installation changes
- Update this file for development changes
- Add inline comments for complex code

## Architecture

### V1 (ExtendScript - Legacy)
- **Target**: InDesign 2022 and older
- **Engine**: ExtendScript (ES3)
- **Dependencies**: 
  - `restix.jsx` for HTTP requests
  - `json.jsx` for JSON handling
- **License**: GPL v3.0 (due to dependencies)

### V2 (UXP - Modern)
- **Target**: InDesign 2023 and newer
- **Engine**: UXP JavaScript (ES6+)
- **Features**:
  - Native `fetch()` API
  - Async/await support
  - Modern dialog system
  - Better error handling
- **License**: Apache 2.0

### Build System
- **Node.js**: Build scripts and tooling
- **GitHub Actions**: CI/CD automation
- **Semantic versioning**: Git tag-based versioning
- **Multi-platform**: Windows, macOS, Universal packages

## Contributing

### Bug Reports
1. Check existing issues first
2. Create detailed issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - System information
   - InDesign version

### Feature Requests
1. Check existing issues and discussions
2. Describe the use case
3. Propose implementation approach
4. Consider backward compatibility

### Code Contributions
1. Follow the development workflow above
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Follow existing code style

### Documentation
1. Use clear, concise language
2. Include code examples
3. Test instructions on different platforms
4. Update relevant files (README, INSTALLATION, etc.)

## Release Process

### Automated Release (Recommended)
```bash
npm run release 2.1.0
```

This will:
1. Update version in package.json and source files
2. Create and push a git tag
3. Trigger GitHub Actions to build and create release

### Manual Release
1. Update version numbers manually
2. Create git tag: `git tag -a v2.1.0 -m "Release 2.1.0"`
3. Push tag: `git push origin v2.1.0`
4. GitHub Actions will handle the rest

### What Happens During Release
1. **CI runs**: Tests and builds on multiple platforms
2. **Artifacts created**: Zip files, installers, metadata
3. **GitHub release**: Created with downloadable assets
4. **NPM publish**: Package published to npm registry

## Security

### API Key Handling
- API keys are stored in source files (user responsibility)
- Never commit API keys to repository
- Document security considerations clearly

### Dependencies
- Regular security audits via `npm audit`
- Automated dependency updates
- Vulnerability scanning in CI

### Code Review
- All changes require review
- Automated security checks
- Manual verification of sensitive changes

## Troubleshooting

### Common Development Issues

#### Build Failures
- Check Node.js version (16+)
- Run `npm install` to update dependencies
- Check for file permission issues

#### Test Failures
- Run tests individually to isolate issues
- Check that all files are present
- Verify package.json configuration

#### Version Issues
- Ensure git tags are properly formatted
- Check that version script has execute permissions
- Verify git repository is clean

## Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Discord**: Real-time chat (if available)
- **Documentation**: Check README and guides first

## License

This project is licensed under the Apache 2.0 License for v2 and GPL v3.0 for v1. See the LICENSE.txt files for details.