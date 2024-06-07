import { expect, describe, it } from "vitest";

export function add(a: number, b: number): number {
  return a + b;
}

describe("add function", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("adds negatives correctly", () => {
    expect(add(-1, -1)).toBe(-2);
  });

  it("adds zeros", () => {
    expect(add(0, 0)).toBe(0);
  });
});
