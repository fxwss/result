import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/is-result", () => {
  test("isResult with Result", () => {
    const result = Result.ok("value");
    expect(Result.isResult(result)).toBe(true);
  });

  test("isResult with non-Result", () => {
    const notAResult = { status: "unknown" };
    expect(Result.isResult(notAResult)).toBe(false);
  });
});
