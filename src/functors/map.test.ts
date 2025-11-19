import { describe, test, expect } from "bun:test";

import { map } from "./map";

describe("map functor", () => {
  test("should apply function to value", () => {
    const value = 5;
    const fn = (x: number) => x * 2;
    const result = map(value, fn);
    expect(result).toBe(10);
  });
});
