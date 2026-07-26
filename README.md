# @tokenring-ai/typescript

## Overview

The `@tokenring-ai/typescript` package provides TypeScript language validation support for the TokenRing ecosystem. It integrates with the FileSystemService and AgentLifecycleService to register file validators for TypeScript files, enabling real-time syntax checking and error detection for TypeScript code.

This package uses the TypeScript 6.x compiler API for syntax analysis. Note that TypeScript 7.0 ships no stable programmatic API, so the 6.x API package is used for `createSourceFile` and `parseDiagnostics` until 7.1 provides a replacement.

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

| Package                   | Version      | Description                       |
|---------------------------|--------------|-----------------------------------|
| `@tokenring-ai/app`       | workspace:*  | Base application framework        |
| `@tokenring-ai/filesystem`| workspace:*  | File management and validation    |
| `@tokenring-ai/lifecycle` | workspace:*  | Lifecycle hook management         |
| `@typescript/typescript6` | ^6.0.2       | TypeScript compiler API (6.x)     |
| `zod`                     | ^4.4.3       | Schema validation                 |

## Chat Commands

This package does not define any chat commands.

## Tools

This package does not define any tools.

## Configuration

The `@tokenring-ai/typescript` package requires no configuration. The plugin config schema is defined as an empty object:

```typescript
const packageConfigSchema = z.object({});
```

All TypeScript file extensions are automatically registered upon plugin installation.

## Plugin Registration

```typescript
import { TokenRingPlugin } from "@tokenring-ai/app";
import { z } from "zod";
import plugin from "@tokenring-ai/typescript/plugin";

const packageConfigSchema = z.object({});

export default plugin satisfies TokenRingPlugin<typeof packageConfigSchema>;
```

### Plugin Properties

| Property      | Value                        |
|---------------|------------------------------|
| `name`        | `@tokenring-ai/typescript`   |
| `displayName` | `TypeScript Tooling`         |
| `version`     | `0.2.0`                      |
| `description` | `TokenRing TypeScript validation integration` |

## Core Components

### TypescriptService

The main service that implements TypeScript validation using the TypeScript compiler API.

**Export:**

```typescript
import { TypescriptService } from "@tokenring-ai/typescript";
```

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

| Extension | Script Kind           | Description              |
|-----------|-----------------------|--------------------------|
| `.ts`     | `ts.ScriptKind.TS`    | Standard TypeScript files |
| `.tsx`    | `ts.ScriptKind.TSX`   | TypeScript JSX files      |
| `.mts`    | `ts.ScriptKind.TS`    | TypeScript ES modules     |
| `.cts`    | `ts.ScriptKind.TS`    | TypeScript CommonJS modules |

**Error Format:**

```text
line:column error error_message
```

**Example Output:**

```text
1:10 error Type 'string' is not assignable to type 'number'.
```

### typescriptFileValidator Hook

A lifecycle hook that automatically validates TypeScript files after write operations.

**Hook Details:**

| Property      | Value                                        |
|---------------|----------------------------------------------|
| `name`        | `typescriptFileValidator`                    |
| `displayName` | `TypeScrtipt/Validate files after write`     |
| `description` | `Automatically validates written typescript files using the typescript compiler` |
| `Trigger`     | `FileValidatonAfterFileWrite`                |

**Functionality:**

- Checks if the file extension is a supported TypeScript extension
- Calls `TypescriptService.validateFile()` for TypeScript files
- Returns validation result or `null` for non-TypeScript files

## Usage Examples

### Basic Plugin Installation

Install the plugin in your TokenRing application:

```typescript
import { TokenRingApp } from "@tokenring-ai/app";
import typescriptPlugin from "@tokenring-ai/typescript/plugin";

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// TypeScript validators are now registered and will validate files after write
```

### Manual Service Usage

You can also use the service directly:

```typescript
import { TypescriptService } from "@tokenring-ai/typescript";

const service = new TypescriptService();

const content = `
const x: number = "string"; // Type error
`;

const result = service.validateFile("example.ts", content);

if (result.valid) {
  console.log("No syntax errors");
} else {
  console.log("Syntax errors found:");
  console.log(result.result);
}
```

### Integration with FileSystemService

The plugin automatically integrates with FileSystemService through the lifecycle hooks:

```typescript
import { TokenRingApp } from "@tokenring-ai/app";
import FileSystemService from "@tokenring-ai/filesystem/FileSystemService";
import typescriptPlugin from "@tokenring-ai/typescript/plugin";

const app = new TokenRingApp();

await app.install(typescriptPlugin);

// Access the file service and validate files
const fileService = await app.getService(FileSystemService);

// Files will be automatically validated after write operations
```

## Integration

### With FileSystemService

The plugin adds the TypescriptService to the application, which is then accessed by the lifecycle hook via `agent.requireServiceByType(TypescriptService)`:

```typescript
app.addServices(new TypescriptService());
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

## Testing

The package uses `bun test` for testing.

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Build (type check)
bun build
```

### Test Configuration

```typescript
export default {
  test: {
    include: ["**/*.test.ts"],
    environment: "node",
  },
};
```

## Package Structure

```text
plugin/typescript/
├── index.ts                        # Package exports
├── plugin.ts                       # Plugin definition and installation
├── TypescriptService.ts            # Core service implementation
├── hooks/
│   └── typescriptFileValidator.ts  # Lifecycle hook for file validation
├── bun.config.ts                   # Bun test configuration
├── package.json                    # Package configuration
├── LICENSE                         # MIT License
└── README.md                       # This documentation
```

### Exports

The package exports the following:

```typescript
export { TypescriptService } from "./TypescriptService.ts";
```

## License

MIT License - see LICENSE file for details.

## Related Components

- `@tokenring-ai/filesystem` - File management and validation system
- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/lifecycle` - Lifecycle and hook management
