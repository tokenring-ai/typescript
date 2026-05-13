# @tokenring-ai/typescript

## Overview

The `@tokenring-ai/typescript` package provides TypeScript language validation support for the TokenRing ecosystem. It
integrates with the FileSystemService and AgentLifecycleService to register file validators for TypeScript files,
enabling real-time syntax checking and error detection for TypeScript code.

## Key Features

- **TypeScript Syntax Validation**: Real-time validation of TypeScript, TSX, MTS, and CTS files
- **FileSystemService Integration**: Seamless integration with the TokenRing file management system
- **Error Reporting**: Detailed error messages with line and column information
- **Multiple File Type Support**: Supports `.ts`, `.tsx`, `.mts`, and `.cts` file extensions
- **Compiler API Integration**: Leverages the TypeScript compiler API for accurate syntax analysis
- **Lifecycle Hooks**: Automatic validation of TypeScript files after write operations

## Installation

```bash
bun add @tokenring-ai/typescript
```

### Package Dependencies

- `@tokenring-ai/app` (0.2.0)
- `@tokenring-ai/filesystem` (0.2.0)
- `@tokenring-ai/lifecycle` (0.2.0)
- `typescript` (^6.0.2)
- `zod` (^4.3.6)

### Development Dependencies

- `vitest` (^4.1.1)

## Core Components

### TypescriptService

The main service that implements TypeScript validation using the TypeScript compiler API.

**Type Signature:**

```typescript
class TypescriptService implements TokenRingService {
  readonly name = "TypescriptService";
  readonly description = "A service that implements TypeScript validation and linting using the TypeScript compiler.";

  validateFile(filePath: string, content: string): Required<FileValidationResult>
}
```

**Functionality:**

- Implements the `TokenRingService` interface
- Validates TypeScript syntax using the compiler API
- Determines the appropriate script kind based on file extension
- Creates a TypeScript source file and extracts parse diagnostics
- Returns formatted error messages with location information

**Supported File Extensions:**

The service supports the following TypeScript file extensions via the `TS_EXTENSIONS` constant:

- `.ts` - Standard TypeScript files
- `.tsx` - TypeScript JSX files
- `.mts` - TypeScript ES modules
- `.cts` - TypeScript CommonJS modules

**Error Format:**

```text
line:column error error_message
```

**Example Output:**

```text
1:10 error Type 'string' is not assignable to type 'number'.
```

### Plugin

The plugin registers the TypescriptService and lifecycle hooks with the application.

**Plugin Configuration:**

- No configuration options required
- Automatically registers the TypescriptService
- Registers file validation hooks with AgentLifecycleService

```typescript
const packageConfigSchema = z.object({});
```

## Usage Examples

### Basic Plugin Installation

Install the plugin in your TokenRing application:

```typescript
import { TokenRingApp } from '@tokenring-ai/app';
import typescriptPlugin from '@tokenring-ai/typescript/plugin';

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// TypeScript validators are now registered and will validate files after write
```

### Manual Service Usage

You can also use the service directly:

```typescript
import { TypescriptService } from '@tokenring-ai/typescript';

const service = new TypescriptService();

const content = `
const x: number = "string"; // Type error
`;

const result = service.validateFile('example.ts', content);

if (result.valid) {
  console.log('No syntax errors');
} else {
  console.log('Syntax errors found:');
  console.log(result.result);
}
```

### Integration with FileSystemService

The plugin automatically integrates with FileSystemService through the lifecycle hooks:

```typescript
import { TokenRingApp } from '@tokenring-ai/app';
import FileSystemService from '@tokenring-ai/filesystem/FileSystemService';
import typescriptPlugin from '@tokenring-ai/typescript/plugin';

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// Access the file service and validate files
const fileService = await app.getService(FileSystemService);

// Files will be automatically validated after write operations
```

## Configuration

The `@tokenring-ai/typescript` package requires no configuration. The plugin schema is defined as:

```typescript
const packageConfigSchema = z.object({});
```

All TypeScript file extensions are automatically registered upon plugin installation.

## Integration

### With FileSystemService

The plugin waits for FileSystemService to be available before registering the TypescriptService:

```typescript
app.waitForService(FileSystemService, fileSystemService => {
  app.addServices(new TypescriptService());
});
```

### With AgentLifecycleService

The plugin registers file validation hooks with the AgentLifecycleService:

```typescript
app.waitForService(AgentLifecycleService, lifecycleService => {
  lifecycleService.addHooks(typescriptFileValidator);
});
```

### With TokenRingApp

Install the plugin during application initialization:

```typescript
await app.install(typescriptPlugin);
```

## Hooks

### typescriptFileValidator

A lifecycle hook that automatically validates TypeScript files after write operations.

**Hook Details:**

- **Name**: `typescriptFileValidator`
- **Display Name**: `TypeScrtipt/Validate files after write`
- **Description**: Automatically validates written typescript files using the typescript compiler
- **Trigger**: `FileValidatonAfterFileWrite`

**Functionality:**

- Checks if the file extension is a supported TypeScript extension
- Calls `TypescriptService.validateFile()` for TypeScript files
- Returns validation result or `null` for non-TypeScript files

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

```text
pkg/typescript/
├── index.ts                        # Package exports
├── plugin.ts                       # Plugin definition and installation
├── TypescriptService.ts            # Core service implementation
├── hooks/
│   └── typescriptFileValidator.ts  # Lifecycle hook for file validation
├── package.json                    # Package configuration
├── vitest.config.ts               # Test configuration
├── LICENSE                         # MIT License
└── README.md                       # This documentation
```

### Exports

The package exports the following:

```typescript
export { TypescriptService } from "./TypescriptService.ts";
```

### Runtime Dependencies

**Production Dependencies:**

- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/filesystem` - File management and validation
- `@tokenring-ai/lifecycle` - Lifecycle hook management
- `typescript` - TypeScript compiler API
- `zod` - Schema validation

**Development Dependencies:**

- `vitest` - Testing framework

## License

MIT License - see LICENSE file for details.

## Related Components

- `@tokenring-ai/filesystem` - File management and validation system
- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/lifecycle` - Lifecycle and hook management
- `@tokenring-ai/utility` - Shared utilities and helpers
