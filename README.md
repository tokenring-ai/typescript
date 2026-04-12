# @tokenring-ai/typescript

## Overview

The `@tokenring-ai/typescript` package provides TypeScript language validation support for the TokenRing ecosystem. It integrates with the FileSystemService to register file validators for TypeScript files, enabling real-time syntax checking and error detection for TypeScript code.

## Key Features

- **TypeScript Syntax Validation**: Real-time validation of TypeScript, TSX, MTS, and CTS files
- **FileSystemService Integration**: Seamless integration with the TokenRing file management system
- **Error Reporting**: Detailed error messages with line and column information
- **Multiple File Type Support**: Supports `.ts`, `.tsx`, `.mts`, and `.cts` file extensions
- **Compiler API Integration**: Leverages the TypeScript compiler API for accurate syntax analysis

## Installation

```bash
bun add @tokenring-ai/typescript
```

### Dependencies

- `@tokenring-ai/app` (0.2.0)
- `@tokenring-ai/filesystem` (0.2.0)
- `typescript` (^6.0.2)
- `zod` (^4.3.6)

## Core Components

### TypescriptFileValidator

The core file validator implementation that checks TypeScript syntax errors.

**Type Signature:**

```typescript
type FileValidator = (filePath: string, content: string) => Promise<string | null>
```

**Functionality:**

- Accepts a file path and file content
- Determines the appropriate TypeScript script kind based on file extension
- Creates a TypeScript source file using the compiler API
- Extracts syntax errors from parse diagnostics
- Returns formatted error messages or `null` if no errors

**Supported File Extensions:**

- `.ts` - Standard TypeScript files
- `.tsx` - TypeScript JSX files
- `.mts` - TypeScript ES modules
- `.cts` - TypeScript CommonJS modules

### Plugin

The plugin registers TypeScript file validators with the FileSystemService.

**Plugin Configuration:**

- No configuration options required
- Automatically registers validators for all supported TypeScript extensions

## Usage Examples

### Basic Plugin Installation

Install the plugin in your TokenRing application:

```typescript
import { TokenRingApp } from '@tokenring-ai/app';
import typescriptPlugin from '@tokenring-ai/typescript/plugin';

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// TypeScript validators are now registered for .ts, .tsx, .mts, and .cts files
```

### Manual Validator Usage

You can also use the validator directly:

```typescript
import TypescriptFileValidator from '@tokenring-ai/typescript/TypescriptFileValidator';

const content = `
const x: number = "string"; // Type error
`;

const errors = await TypescriptFileValidator('example.ts', content);

if (errors) {
  console.log('Syntax errors found:');
  console.log(errors);
} else {
  console.log('No syntax errors');
}
```

### Integration with FileSystemService

The plugin automatically integrates with FileSystemService:

```typescript
import { TokenRingApp } from '@tokenring-ai/app';
import FileSystemService from '@tokenring-ai/filesystem/FileSystemService';
import typescriptPlugin from '@tokenring-ai/typescript/plugin';

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// Access the file service and validate files
const fileService = await app.getService(FileSystemService);

const validationResult = await fileService.validateFile('example.ts', content);

if (validationResult) {
  console.log('Validation errors:', validationResult);
}
```

## Configuration

The `@tokenring-ai/typescript` package requires no configuration. The plugin schema is defined as:

```typescript
const packageConfigSchema = z.object({});
```

All TypeScript file extensions are automatically registered upon plugin installation.

## Integration

### With FileSystemService

The plugin registers file validators with the FileSystemService for all supported TypeScript extensions:

```typescript
fileSystemService.registerFileValidator('.ts', TypescriptFileValidator);
fileSystemService.registerFileValidator('.tsx', TypescriptFileValidator);
fileSystemService.registerFileValidator('.mts', TypescriptFileValidator);
fileSystemService.registerFileValidator('.cts', TypescriptFileValidator);
```

### With TokenRingApp

Install the plugin during application initialization:

```typescript
await app.install(typescriptPlugin);
```

## Error Handling

The validator returns formatted error messages with location information:

**Error Format:**

```
line:column error error_message
```

**Example:**

```
1:10 error Type 'string' is not assignable to type 'number'.
```

If no errors are found, the validator returns `null`.

## Testing

### Running Tests

```bash
bun test
```

### Test Configuration

The package uses Vitest for testing with the following configuration:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    environment: 'node',
    globals: true,
    isolate: true,
  },
});
```

### Building

```bash
bun run build
```

The build command runs TypeScript type checking without emitting output.

## Development

### Package Structure

```
pkg/typescript/
├── index.ts                    # Package exports
├── plugin.ts                   # Plugin definition and installation
├── TypescriptFileValidator.ts  # Core validator implementation
├── package.json               # Package configuration
├── vitest.config.ts          # Test configuration
└── README.md                  # This documentation
```

### Dependencies

**Production Dependencies:**

- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/filesystem` - File management and validation
- `typescript` - TypeScript compiler API
- `zod` - Schema validation

**Development Dependencies:**

- `vitest` - Testing framework

## License

MIT License - see LICENSE file for details.

## Related Components

- `@tokenring-ai/filesystem` - File management and validation system
- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/utility` - Shared utilities and helpers
