import { describe, expect, test } from "bun:test";

import { err, ok } from "../implementation";
import { flatMap } from "../operators/flat-map";

describe("map error operator", () => {
  test("should map an Err result", () => {
    const result = err("error");
    const mapped = flatMap(result, (x: number) => ok(x * 2));

    expect(mapped.kind).toBe("err");
    expect(mapped.error).toBe("error");
  });

  test("should not map an Ok result", () => {
    const result = ok(2);

    const mapped = flatMap<number, Error>(result, (_x) => {
      throw new Error("mapping error");
    });

    expect(mapped.kind).toBe("err");
    expect(Error.isError(mapped.error)).toBe(true);
    expect(mapped.error.message).toBe("mapping error");
  });
});
