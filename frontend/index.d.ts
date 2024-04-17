import type * as vitest from "vitest";
import * as integration from "./tests/factory";

declare module "vitest" {
  export interface TestContext {
    request: Request;
    integration: typeof integration;
  }
}
