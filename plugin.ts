import type {TokenRingPlugin} from "@tokenring-ai/app";
import FileSystemService from "@tokenring-ai/filesystem/FileSystemService";
import {z} from "zod";
import packageJSON from "./package.json" with {type: "json"};
import {TS_EXTENSIONS, TypescriptFileValidator} from "./TypescriptFileValidator.ts";

const packageConfigSchema = z.object({});

export default {
  name: packageJSON.name,
  displayName: "TypeScript Tooling",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, _config) {
    app.waitForService(FileSystemService, (fileSystemService) => {
      const validator = new TypescriptFileValidator();

      for (const ext in TS_EXTENSIONS) {
        fileSystemService.registerFileValidator(ext, validator);
      }
    });
  },
  config: packageConfigSchema,
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
