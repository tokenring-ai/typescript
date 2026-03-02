import type {FileValidator} from "@tokenring-ai/filesystem/FileSystemService";
import ts from "typescript";

const TS_EXTENSIONS: Record<string, ts.ScriptKind> = {
  ".ts": ts.ScriptKind.TS,
  ".tsx": ts.ScriptKind.TSX,
  ".mts": ts.ScriptKind.TS,
  ".cts": ts.ScriptKind.TS,
};

const TypescriptFileValidator: FileValidator = async (filePath, content) => {
  const ext = filePath.slice(filePath.lastIndexOf("."));
  const scriptKind = TS_EXTENSIONS[ext] ?? ts.ScriptKind.TS;

  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ESNext, true, scriptKind);
  const diagnostics = (sourceFile as any).parseDiagnostics as ts.Diagnostic[] ?? [];

  const syntaxDiagnostics = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
  if (syntaxDiagnostics.length === 0) return null;

  return syntaxDiagnostics.map(d => {
    const pos = d.file && d.start != null ? d.file.getLineAndCharacterOfPosition(d.start) : null;
    const loc = pos ? `${pos.line + 1}:${pos.character + 1}` : "?:?";
    return `${loc} error ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`;
  }).join("\n");
};

export default TypescriptFileValidator;
