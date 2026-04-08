import { describe, expect, test } from "bun:test";
import type { Result } from "../foundation";
import { err, ok } from "../implementation";
import { inspect } from "./inspect";

describe("inspect", () => {
  test("should call fn with value for Ok result", () => {
    const values: number[] = [];
    const result = inspect(ok(42), (v) => values.push(v));

    expect(result.kind).toBe("ok");
    expect(result.value).toBe(42);
    expect(values).toEqual([42]);
  });

  test("should not call fn for Err result", () => {
    const values: number[] = [];
    const result = inspect(err("error") as Result<number, string>, (v) =>
      values.push(v),
    );

    expect(result.kind).toBe("err");
    expect(values).toEqual([]);
  });

  test("should return the same result unchanged", () => {
    const original = ok(42);
    const result = inspect(original, () => {});

    expect(result).toBe(original);
  });
});
