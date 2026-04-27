import type { TokenRingService } from "@tokenring-ai/app/types";
import type { FileValidationResult } from "@tokenring-ai/filesystem/util/runFileValidator";
import ts from "typescript";

export const TS_EXTENSIONS: Record<string, ts.ScriptKind> = {
  ".ts": ts.ScriptKind.TS,
  ".tsx": ts.ScriptKind.TSX,
  ".mts": ts.ScriptKind.TS,
  ".cts": ts.ScriptKind.TS,
};

export class TypescriptService implements TokenRingService {
  readonly name = "TypescriptService";
  readonly description = "A service that implements TypeScript validation and linting using the TypeScript compiler.";

  validateFile(filePath: string, content: string): Required<FileValidationResult> {
    const ext = filePath.slice(filePath.lastIndexOf("."));
    const scriptKind = TS_EXTENSIONS[ext] ?? ts.ScriptKind.TS;

    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ESNext, true, scriptKind);
    const diagnostics = ((sourceFile as any).parseDiagnostics as ts.Diagnostic[]) ?? [];

    const syntaxDiagnostics = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
    if (syntaxDiagnostics.length === 0) return { valid: true, result: "No issues found." };


    const result = syntaxDiagnostics
      .map(d => {
        const pos = d.file && d.start != null ? d.file.getLineAndCharacterOfPosition(d.start) : null;
        const loc = pos ? `${pos.line + 1}:${pos.character + 1}` : "?:?";
        return `${loc} error ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`;
      })
      .join("\n");

    return { valid: false, result };
  }
}
