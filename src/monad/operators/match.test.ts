import { describe, test, expect } from "bun:test";
import { err, ok } from "../implementation";
import { match } from "./match";

describe("match operator", () => {
  test("match ok value", () => {
    const value = ok(42);

    const result = match(value, {
      ok: (v) => `Value is ${v}`,
      err: (e) => `Error: ${e}`,
    });

    expect(result).toBe("Value is 42");
  });

  test("match err value", () => {
    const value = err("Something went wrong");

    const result = match(value, {
      ok: (v) => `Value is ${v}`,
      err: (e) => `Error: ${e}`,
    });

    expect(result).toBe("Error: Something went wrong");
  });
});
