declare module "vitest" {
  export interface TestContext {
    request: Request;
  }
}
