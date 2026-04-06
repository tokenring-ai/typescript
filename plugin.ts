import {TokenRingPlugin} from "@tokenring-ai/app";
import FileSystemService from "@tokenring-ai/filesystem/FileSystemService";
import {z} from "zod";
import TypescriptFileValidator from "./TypescriptFileValidator.ts";
import packageJSON from './package.json' with {type: 'json'};

const packageConfigSchema = z.object({});

const TS_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];

export default {
  name: packageJSON.name,
  displayName: "TypeScript Tooling",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    app.waitForService(FileSystemService, fileSystemService => {
      for (const ext of TS_EXTENSIONS) {
        fileSystemService.registerFileValidator(ext, TypescriptFileValidator);
      }
    });
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
