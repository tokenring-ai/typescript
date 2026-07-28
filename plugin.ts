import type { TokenRingPlugin } from "@tokenring-ai/app";
import { AgentLifecycleService } from "@tokenring-ai/lifecycle";
import typescriptFileValidator from "./hooks/typescriptFileValidator.ts";
import packageJSON from "./package.json" with { type: "json" };
import { TypescriptService } from "./TypescriptService.ts";

export default {
  name: packageJSON.name,
  displayName: "TypeScript Tooling",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app) {
    app.addServices(new TypescriptService());

    // Register hooks with the lifecycle service
    app.waitForService(AgentLifecycleService, lifecycleService => {
      lifecycleService.addHooks(typescriptFileValidator);
    });
  },
} satisfies TokenRingPlugin;
