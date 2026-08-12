import { FileValidationAfterFileWrite } from "@tokenring-ai/filesystem/util/runFileValidator";
import type { HookSubscription } from "@tokenring-ai/lifecycle/types";
import { HookCallback } from "@tokenring-ai/lifecycle/util/hooks";
import { TS_EXTENSIONS, TypescriptService } from "../TypescriptService.ts";

const name = "typescriptFileValidator";
const displayName = "TypeScript/Validate files after write";
const description = "Automatically validates written typescript files using the typescript compiler";

const callbacks = [
  new HookCallback(FileValidationAfterFileWrite, (data, agent) => {
    if (Object.hasOwn(TS_EXTENSIONS, data.fileExtension)) {
      return agent.requireService(TypescriptService).validateFile(data.filePath, data.content);
    }
    return null;
  }),
];
export default {
  name,
  displayName,
  description,
  callbacks,
} satisfies HookSubscription;
