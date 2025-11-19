import { describe, test, expect } from "bun:test";

import { err, ok } from "./implementation";

describe("implementation", () => {
  test("should produce an ok result", () => {
    const result = ok(2);

    expect(result.kind).toBe("ok");
    expect(result.value).toBe(2);
  });

  test("should produce an err result", () => {
    const result = err("error");

    expect(result.kind).toBe("err");
    expect(result.error).toBe("error");
  });
});
