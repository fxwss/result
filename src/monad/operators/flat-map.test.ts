import { describe, test, expect } from "bun:test";

import { err, ok } from "../implementation";
import { flatMap } from "../operators/flat-map";
import { isResult } from "../../utilitary/is-result";

describe("flat map operator", () => {
  test("should map an Ok result", () => {
    const result = ok(2);
    const mapped = flatMap(result, (x) => ok(x * 2));

    expect(mapped.kind).toBe("ok");
    expect(mapped.value).toBe(4);
  });

  test("should work without wrapping in Ok", () => {
    const result = ok(2);
    const mapped = flatMap(result, (x) => x * 2);

    expect(mapped.kind).toBe("ok");
    expect(mapped.value).toBe(4);
  });

  test("should not map an Err result", () => {
    const result = err("error");
    const mapped = flatMap(result, (x: number) => ok(x * 2));

    expect(mapped.kind).toBe("err");
    expect(mapped.error).toBe("error");
  });

  test("should handle exceptions in the mapping function", () => {
    const result = ok(2);

    const mapped = flatMap<number, Error>(result, (x) => {
      throw new Error("mapping error");
    });

    expect(mapped.kind).toBe("err");
    expect(Error.isError(mapped.error)).toBe(true);
    expect(mapped.error.message).toBe("mapping error");
  });
});
