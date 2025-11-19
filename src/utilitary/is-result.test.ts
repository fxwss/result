import { describe, test, expect } from "bun:test";

import { err, ok } from "../monad/implementation";
import { isResult } from "./is-result";

describe("is-result", () => {
  test("should identify an Ok result", () => {
    const result = ok(42);
    expect(isResult(result)).toBe(true);
  });

  test("should identify an Err result", () => {
    const result = err("error");
    expect(isResult(result)).toBe(true);
  });

  test("should reject a non-Result value", () => {
    const notAResult = { value: 42 };
    expect(isResult(notAResult)).toBe(false);
  });
});
