import { describe, test, expect } from "bun:test";
import { ok, err } from "./result";

describe("Result API", () => {
  describe("ok", () => {
    test("should create an Ok result", () => {
      const result = ok(42);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });
  });

  describe("err", () => {
    test("should create an Err result", () => {
      const result = err("error message");

      expect(result.kind).toBe("err");
      expect(result.error).toBe("error message");
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
    });
  });

  describe("map", () => {
    test("should map an Ok result", () => {
      const result = ok(5).map((x) => x * 2);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(10);
    });

    test("should not map an Err result", () => {
      const result = err<number, string>("error").map((x) => x * 2);

      expect(result.kind).toBe("err");
      expect(result.error).toBe("error");
    });

    test("should chain multiple maps", () => {
      const result = ok(2)
        .map((x) => x + 3)
        .map((x) => x * 2)
        .map((x) => `Result: ${x}`);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe("Result: 10");
    });

    test("should handle exceptions in map", () => {
      const result = ok(5).map(() => {
        throw new Error("mapping error");
      });

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
      if (result.isErr()) {
        expect((result.error as Error).message).toBe("mapping error");
      }
    });
  });

  describe("flatMap", () => {
    test("should flatMap an Ok result", () => {
      const result = ok(5).flatMap((x) => ok(x * 2));

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(10);
    });

    test("should flatten nested Results", () => {
      const result = ok(5)
        .flatMap((x) => ok(x * 2))
        .flatMap((x) => ok(x + 1));

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(11);
    });

    test("should short-circuit on Err", () => {
      const result = ok(5)
        .flatMap((x) => err<number, string>("error"))
        .flatMap((x) => ok(x * 2));

      expect(result.kind).toBe("err");
      expect(result.error).toBe("error");
    });

    test("should not flatMap an Err result", () => {
      const result = err<number, string>("initial error").flatMap((x) =>
        ok(x * 2)
      );

      expect(result.kind).toBe("err");
      expect(result.error).toBe("initial error");
    });

    test("should handle conditional logic", () => {
      const divide = (a: number, b: number) =>
        b === 0 ? err<number, string>("division by zero") : ok(a / b);

      const result1 = ok(10).flatMap((x) => divide(x, 2));
      expect(result1.kind).toBe("ok");
      expect(result1.value).toBe(5);

      const result2 = ok(10).flatMap((x) => divide(x, 0));
      expect(result2.kind).toBe("err");
      expect(result2.error).toBe("division by zero");
    });
  });

  describe("mapErr", () => {
    test("should map an Err result", () => {
      const result = err<number, string>("error").mapErr((e) => `Error: ${e}`);

      expect(result.kind).toBe("err");
      expect(result.error).toBe("Error: error");
    });

    test("should not map an Ok result", () => {
      const result = ok<number, string>(42).mapErr((e) => `Error: ${e}`);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(42);
    });

    test("should transform error types", () => {
      const result = err<number, string>("error message").mapErr(
        (msg) => new Error(msg)
      );

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
      if (result.isErr()) {
        expect((result.error as Error).message).toBe("error message");
      }
    });

    test("should chain mapErr with map", () => {
      const result = ok<number, string>(5)
        .map((x) => x * 2)
        .mapErr((e) => new Error(e));

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(10);
    });
  });

  describe("match", () => {
    test("should match on Ok", () => {
      const result = ok(42).match({
        ok: (v) => `Success: ${v}`,
        err: (e) => `Error: ${e}`,
      });

      expect(result).toBe("Success: 42");
    });

    test("should match on Err", () => {
      const result = err("failure").match({
        ok: (v) => `Success: ${v}`,
        err: (e) => `Error: ${e}`,
      });

      expect(result).toBe("Error: failure");
    });

    test("should handle different return types", () => {
      const result1 = ok(42).match({
        ok: (v) => v * 2,
        err: () => 0,
      });
      expect(result1).toBe(84);

      const result2 = err("error").match({
        ok: (v: number) => v * 2,
        err: () => 0,
      });
      expect(result2).toBe(0);
    });

    test("should work with complex transformations", () => {
      type ApiResponse = { data: string };

      const result = ok<ApiResponse, string>({ data: "hello" }).match({
        ok: (res) => res.data.toUpperCase(),
        err: (e) => `Failed: ${e}`,
      });

      expect(result).toBe("HELLO");
    });
  });

  describe("unwrap", () => {
    test("should unwrap an Ok result", () => {
      const result = ok(42);
      expect(result.unwrap()).toBe(42);
    });

    test("should throw on Err result", () => {
      const result = err("error");
      expect(() => result.unwrap()).toThrow();
    });

    test("should throw specific error", () => {
      const result = err("error");
      expect(() => result.unwrap()).toThrow("Tried to unwrap an Err result");
    });
  });

  describe("unwrapOr", () => {
    test("should unwrap an Ok result", () => {
      const result = ok(42);
      expect(result.unwrapOr(0)).toBe(42);
    });

    test("should return default value on Err", () => {
      const result = err<number, string>("error");
      expect(result.unwrapOr(0)).toBe(0);
    });

    test("should work with different types", () => {
      const result = err<string, string>("error");
      expect(result.unwrapOr("default")).toBe("default");
    });
  });

  describe("isOk and isErr", () => {
    test("should check if result is Ok", () => {
      const result = ok(42);

      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    test("should check if result is Err", () => {
      const result = err("error");

      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });

    test("should narrow types correctly", () => {
      const result = ok<number, string>(42);

      if (result.isOk()) {
        const value: number = result.value;
        expect(value).toBe(42);
      }
    });

    test("should work as type guards", () => {
      const results = [ok(1), err("e1"), ok(2), err("e2")];
      const values = results.filter((r) => r.isOk()).map((r) => r.value);
      const errors = results.filter((r) => r.isErr()).map((r) => r.error);

      expect(values).toEqual([1, 2]);
      expect(errors).toEqual(["e1", "e2"]);
    });
  });

  describe("try", () => {
    test("should wrap successful function call", () => {
      const result = ok(0).try(() => 42);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(42);
    });

    test("should catch exceptions", () => {
      const result = ok(0).try(() => {
        throw new Error("test error");
      });

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
      if (result.isErr()) {
        expect(result.error.message).toBe("test error");
      }
    });

    test("should work with complex operations", () => {
      const result = ok(0).try(() => {
        const data = JSON.parse('{"value": 42}');
        return data.value;
      });

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(42);
    });

    test("should catch JSON parse errors", () => {
      const result = ok(0).try(() => {
        return JSON.parse("invalid json");
      });

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe("await", () => {
    test("should wrap successful promise", async () => {
      const result = await ok(0).await(Promise.resolve(42));

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(42);
    });

    test("should catch promise rejections", async () => {
      const result = await ok(0).await(
        Promise.reject(new Error("async error"))
      );

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
      if (result.isErr()) {
        expect(result.error.message).toBe("async error");
      }
    });

    test("should work with async/await", async () => {
      const fetchData = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { data: "success" };
      };

      const result = await ok(0).await(fetchData());

      expect(result.kind).toBe("ok");
      expect(result.value).toEqual({ data: "success" });
    });

    test("should handle rejected promises with string", async () => {
      const result = await ok(0).await(Promise.reject("string error"));

      expect(result.kind).toBe("err");
      expect(result.error).toBeInstanceOf(Error);
      if (result.isErr()) {
        expect(result.error.message).toBe("string error");
      }
    });
  });

  describe("chaining operations", () => {
    test("should chain map, flatMap, and mapErr", () => {
      const result = ok(5)
        .map((x) => x * 2)
        .flatMap((x) => (x > 5 ? ok(x) : err("too small")))
        .map((x) => x + 1)
        .mapErr((e) => `Error: ${e}`);

      expect(result.kind).toBe("ok");
      expect(result.value).toBe(11);
    });

    test("should handle error in chain", () => {
      const result = ok(2)
        .map((x) => x * 2)
        .flatMap((x) => (x > 5 ? ok(x) : err("too small")))
        .map((x) => x + 1)
        .mapErr((e) => `Error: ${e}`);

      expect(result.kind).toBe("err");
      expect(result.error).toBe("Error: too small");
    });

    test("should work with real world example", () => {
      type User = { id: number; name: string; age: number };

      const findUser = (id: number) =>
        id === 1
          ? ok<User, string>({ id: 1, name: "Alice", age: 30 })
          : err<User, string>("User not found");

      const validateAge = (user: User) =>
        user.age >= 18
          ? ok<User, string>(user)
          : err<User, string>("User is underage");

      const result = ok(1)
        .flatMap(findUser)
        .flatMap(validateAge)
        .map((user) => user.name.toUpperCase())
        .match({
          ok: (name) => `Welcome, ${name}!`,
          err: (error) => `Access denied: ${error}`,
        });

      expect(result).toBe("Welcome, ALICE!");
    });

    test("should handle pipeline with errors", () => {
      type User = { id: number; name: string; age: number };

      const findUser = (id: number) =>
        id === 1
          ? ok<User, string>({ id: 1, name: "Bob", age: 15 })
          : err<User, string>("User not found");

      const validateAge = (user: User) =>
        user.age >= 18
          ? ok<User, string>(user)
          : err<User, string>("User is underage");

      const result = ok(1)
        .flatMap(findUser)
        .flatMap(validateAge)
        .map((user) => user.name.toUpperCase())
        .match({
          ok: (name) => `Welcome, ${name}!`,
          err: (error) => `Access denied: ${error}`,
        });

      expect(result).toBe("Access denied: User is underage");
    });
  });

  describe("toFoundation and fromFoundation", () => {
    test("should convert to foundation", () => {
      const result = ok(42);
      const foundation = result.toFoundation();

      expect(foundation.kind).toBe("ok");
      expect(foundation.value).toBe(42);
    });

    test("should convert from foundation", () => {
      const result = ok(42);
      const foundation = result.toFoundation();
      const converted = result.fromFoundation(foundation);

      expect(converted.kind).toBe("ok");
      expect(converted.value).toBe(42);
    });

    test("should work with error results", () => {
      const result = err("error");
      const foundation = result.toFoundation();
      const converted = result.fromFoundation(foundation);

      expect(converted.kind).toBe("err");
      expect(converted.error).toBe("error");
    });
  });
});
