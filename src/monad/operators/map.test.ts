import { describe, test, expect } from "bun:test";

import { err, ok } from "../implementation";
import { map } from "../operators/map";
import { isResult } from "../../utilitary/is-result";

describe("map operator", () => {
  test("should map an Ok result", () => {
    const result = ok(2);
    const mapped = map(result, (x) => ok(x * 2));

    expect(mapped.kind).toBe("ok");
    expect(isResult(mapped.value)).toBe(true);
    expect(mapped.value.value).toBe(4);
  });

  test("should not map an Err result", () => {
    const result = err("error");
    const mapped = map(result, (x: number) => x * 2);

    expect(mapped.kind).toBe("err");
    expect(mapped.error).toBe("error");
  });

  test("should handle exceptions in the mapping function", () => {
    const result = ok(2);

    const mapped = map<number, Error>(result, (x) => {
      throw new Error("mapping error");
    });

    expect(mapped.kind).toBe("err");
    expect(Error.isError(mapped.error)).toBe(true);
    expect(mapped.error.message).toBe("mapping error");
  });
});
