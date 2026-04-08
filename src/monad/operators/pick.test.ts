import { describe, expect, test } from "bun:test";
import { err, ok } from "../implementation";
import { pick } from "./pick";

describe("pick", () => {
  test("should pick a property from Ok value", () => {
    const result = pick(ok({ name: "Alice", age: 30 }), "name");

    expect(result.kind).toBe("ok");
    expect(result.value).toBe("Alice");
  });

  test("should pick a different property", () => {
    const result = pick(ok({ name: "Alice", age: 30 }), "age");

    expect(result.kind).toBe("ok");
    expect(result.value).toBe(30);
  });

  test("should pass through Err unchanged", () => {
    const result = pick(
      err<string, { name: string }>("error"),
      "name" as never,
    );

    expect(result.kind).toBe("err");
    expect(result.error).toBe("error");
  });
});
