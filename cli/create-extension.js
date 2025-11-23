#!/usr/bin/env node

/**
 * Create Webflow Extension - CLI Scaffolding Tool
 *
 * Usage: node cli/create-extension.js my-extension
 */

const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ Usage: node cli/create-extension.js <project-name>');
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
  console.error(`❌ Directory "${projectName}" already exists`);
  process.exit(1);
}

// Create directory structure
console.log(`📁 Creating project: ${projectName}`);

fs.mkdirSync(projectPath, { recursive: true });
fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

// Create package.json
fs.writeFileSync(
  path.join(projectPath, 'package.json'),
  JSON.stringify(
    {
      name: projectName,
      version: '1.0.0',
      description: 'Webflow Designer Extension',
      main: 'dist/index.js',
      scripts: {
        dev: 'tsc --watch',
        build: 'tsc',
        clean: 'rm -rf dist'
      },
      dependencies: {
        '@webflow/designer-api': '^1.0.0'
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0'
      }
    },
    null,
    2
  )
);

// Create tsconfig.json
fs.writeFileSync(
  path.join(projectPath, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020', 'DOM'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        outDir: './dist',
        rootDir: './src'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    },
    null,
    2
  )
);

// Create manifest.json
fs.writeFileSync(
  path.join(projectPath, 'manifest.json'),
  JSON.stringify(
    {
      name: projectName.replace(/-/g, ' ').toUpperCase(),
      version: '1.0.0',
      description: 'Webflow Designer Extension',
      permissions: ['element:read', 'element:write', 'event:listen'],
      ui: {
        position: 'right',
        width: 400
      }
    },
    null,
    2
  )
);

// Create basic src/index.ts
fs.writeFileSync(
  path.join(projectPath, 'src', 'index.ts'),
  `/**
 * ${projectName} - Webflow Designer Extension
 */

import { webflow } from '@webflow/designer-api';

async function initializeExtension(): Promise<void> {
  try {
    console.log('🚀 Initializing ${projectName}');

    // Create UI
    const container = document.createElement('div');
    container.style.cssText = 'font-family: sans-serif; padding: 16px; font-size: 13px;';
    container.innerHTML = \`
      <h2 style="margin: 0 0 16px 0;">✨ ${projectName}</h2>
      <p>Your extension is ready to develop!</p>
      <p>Start by editing src/index.ts and run: npm run dev</p>
    \`;
    document.body.appendChild(container);

    webflow.notify.success('${projectName} loaded');
  } catch (error) {
    console.error('Initialization failed:', error);
    webflow.notify.error('Failed to initialize');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}
`
);

// Create .gitignore
fs.writeFileSync(
  path.join(projectPath, '.gitignore'),
  `node_modules/
dist/
.DS_Store
*.log
.env
`
);

// Create README.md
fs.writeFileSync(
  path.join(projectPath, 'README.md'),
  `# ${projectName}

Webflow Designer Extension

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev    # Watch mode
npm run build  # Compile
npm run clean  # Clean dist
\`\`\`

## References

- [Webflow Designer API Comprehensive Guide](../COMPLETE-PROJECT-GUIDE.md)
- [API Reference](../guides/01-api-reference.md)
- [Templates](../templates/)
- [Examples](../examples/)

## Getting Help

See the main project guide for troubleshooting and best practices.
`
);

console.log('\n✅ Project created successfully!');
console.log(`\n📦 Next steps:\n`);
console.log(`  cd ${projectName}`);
console.log(`  npm install`);
console.log(`  npm run dev`);
console.log(`\n📖 Learn more: cat ../COMPLETE-PROJECT-GUIDE.md\n`);
