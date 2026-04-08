# @fxwss/result

A TypeScript Result monad library for elegant error handling without exceptions. Inspired by Rust's `Result<T, E>` type, it provides a type-safe way to handle operations that can succeed or fail — without throwing exceptions.

## Installation

```bash
npm install @fxwss/result
# or
yarn add @fxwss/result
# or
bun add @fxwss/result
# or
pnpm add @fxwss/result
```

**Requirements:** TypeScript 5+

## Quick Start

```typescript
import { ok, err, try_, await_ } from "@fxwss/result";

const success = ok(42); // Result<number, never>
const failure = err("oops"); // Result<never, string>

const value = ok(10)
  .map((x) => x * 2)
  .map((x) => x + 1)
  .unwrapOr(0); // 21
```

## API Reference

### Creating Results

#### `ok<T, E>(value: T): Result<T, E>`

Creates a successful result containing a value.

```typescript
const result = ok(42);
result.kind; // "ok"
result.value; // 42
result.error; // undefined
```

#### `err<T, E>(error: E): Result<T, E>`

Creates a failed result containing an error.

```typescript
const result = err("something went wrong");
result.kind; // "err"
result.value; // undefined
result.error; // "something went wrong"
```

#### `try_<T>(fn: () => T): Result<T, Error>`

Wraps a synchronous function call, catching any thrown exceptions into an `Err` result. Thrown values are normalized to `Error` instances.

```typescript
const parsed = try_(() => JSON.parse('{"a": 1}'));
// Ok({ a: 1 })

const invalid = try_(() => JSON.parse("not json"));
// Err(SyntaxError: ...)
```

#### `await_<T>(promise: Promise<T>): Promise<Result<T, Error>>`

Wraps a promise, catching rejections into an `Err` result. Rejected values are normalized to `Error` instances.

```typescript
const result = await await_(fetch("/api/data").then((r) => r.json()));

result.match({
  ok: (data) => console.log(data),
  err: (error) => console.error(error.message),
});
```

---

### Result Methods

Every `Result<T, E>` exposes the following interface:

#### `.map<U>(fn: (value: T) => U): Result<U, E>`

Transforms the `Ok` value. If the result is `Err`, it is returned unchanged.

```typescript
ok(5).map((x) => x * 2); // Ok(10)
err("fail").map((x) => x * 2); // Err("fail")
```

Maps can be chained:

```typescript
ok(2)
  .map((x) => x + 3)
  .map((x) => x * 2)
  .map((x) => `Result: ${x}`);
// Ok("Result: 10")
```

#### `.flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>`

Like `.map()`, but the callback returns a `Result`. Prevents nested `Result<Result<...>>`. Short-circuits on `Err`.

```typescript
const divide = (a: number, b: number) =>
  b === 0 ? err<number, string>("division by zero") : ok(a / b);

ok(10).flatMap((x) => divide(x, 2)); // Ok(5)
ok(10).flatMap((x) => divide(x, 0)); // Err("division by zero")
```

#### `.mapErr<F>(fn: (error: E) => F): Result<T, F>`

Transforms the `Err` value. If the result is `Ok`, it is returned unchanged.

```typescript
err("not found").mapErr((e) => new Error(e));
// Err(Error("not found"))

ok(42).mapErr((e) => new Error(e));
// Ok(42) — unchanged
```

#### `.inspect(fn: (value: T) => void): Result<T, E>`

Runs a side-effect function on the `Ok` value without transforming it. Returns the same result. If the result is `Err`, the function is not called. Useful for logging/debugging in the middle of a chain.

```typescript
ok(42)
  .inspect((v) => console.log("value:", v)) // logs "value: 42"
  .map((x) => x * 2);
// Ok(84)

err("fail")
  .inspect((v) => console.log(v)) // not called
  .map((x) => x * 2);
// Err("fail")
```

#### `.pick<K extends keyof T>(key: K): Result<T[K], E>`

Picks a property from the `Ok` value. A shorthand for `.map((v) => v[key])` with better type inference.

```typescript
ok({ name: "Alice", age: 30 }).pick("name"); // Ok("Alice")
ok({ name: "Alice", age: 30 }).pick("age"); // Ok(30)
err("fail").pick("name" as never); // Err("fail")
```

#### `.match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U`

Pattern-match on the result. Both branches must return the same type.

```typescript
const message = ok(42).match({
  ok: (v) => `Success: ${v}`,
  err: (e) => `Error: ${e}`,
});
// "Success: 42"
```

#### `.unwrap(): T`

Extracts the `Ok` value. **Throws `TriedToUnwrapAnNotOkResultError`** if the result is `Err`.

```typescript
ok(42).unwrap(); // 42
err("x").unwrap(); // throws!
```

#### `.unwrapOr(defaultValue: T): T`

Extracts the `Ok` value, or returns the provided default if `Err`.

```typescript
ok(42).unwrapOr(0); // 42
err("fail").unwrapOr(0); // 0
```

#### `.unwrapErr(): E`

Extracts the `Err` value. **Throws `TriedToUnwrapErrAnOkResultError`** if the result is `Ok`.

```typescript
err("fail").unwrapErr(); // "fail"
ok(42).unwrapErr(); // throws!
```

#### `.isOk(): this is OkResult<T, E>`

Type guard that narrows the result to `OkResult`.

#### `.isErr(): this is ErrResult<T, E>`

Type guard that narrows the result to `ErrResult`.

```typescript
const result = ok<number, string>(42);

if (result.isOk()) {
  result.value; // number (type-safe)
}

if (result.isErr()) {
  result.error; // string (type-safe)
}
```

Works great for filtering arrays of results:

```typescript
const results = [ok(1), err("e1"), ok(2), err("e2")];

const values = results.filter((r) => r.isOk()).map((r) => r.unwrap());
// [1, 2]

const errors = results.filter((r) => r.isErr()).map((r) => r.unwrapErr());
// ["e1", "e2"]
```

#### `.toFoundation(): ResultFoundation<T, E>`

Converts to the plain data representation (a tagged union without methods). Useful for serialization or interop with functional-style code.

#### `fromFoundation<T, E>(result: ResultFoundation<T, E>): Result<T, E>`

Converts a plain foundation result back into the full `Result` object with methods.

---

### Properties

| Property | Type              | Description                          |
| -------- | ----------------- | ------------------------------------ |
| `kind`   | `"ok"` \| `"err"` | Discriminant tag for the result      |
| `value`  | `T \| undefined`  | The success value (undefined if Err) |
| `error`  | `E \| undefined`  | The error value (undefined if Ok)    |

---

### Types

```typescript
import type { Result, OkResult, ErrResult } from "@fxwss/result";
```

- **`Result<T, E>`** — A result that is either `Ok` with value `T` or `Err` with error `E`.
- **`OkResult<T, E>`** — Narrowed type where `kind` is `"ok"`, `value` is `T`, and `error` is `never`.
- **`ErrResult<T, E>`** — Narrowed type where `kind` is `"err"`, `value` is `never`, and `error` is `E`.

---

## Real-World Examples

### Validation Pipeline

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const findUser = (id: number) =>
  id === 1
    ? ok<User, string>({ id: 1, name: "Alice", age: 30 })
    : err<User, string>("User not found");

const validateAge = (user: User) =>
  user.age >= 18
    ? ok<User, string>(user)
    : err<User, string>("User is underage");

const greeting = ok(1)
  .flatMap(findUser)
  .flatMap(validateAge)
  .map((user) => user.name.toUpperCase())
  .match({
    ok: (name) => `Welcome, ${name}!`,
    err: (error) => `Access denied: ${error}`,
  });
// "Welcome, ALICE!"
```

### Safe Division Chain

```typescript
const divide = (a: number, b: number) =>
  b === 0 ? err<number, string>("Division by zero") : ok(a / b);

const result = ok(10)
  .flatMap((x) => divide(x, 2))
  .map((x) => x * 2)
  .unwrapOr(0);
// 10
```

### Error Transformation

```typescript
const result = ok(5)
  .map((x) => x * 2)
  .flatMap((x) => (x > 5 ? ok(x) : err("too small")))
  .map((x) => x + 1)
  .mapErr((e) => `Error: ${e}`);
// Ok(11)
```

### Wrapping Async APIs

```typescript
async function fetchUser(id: number) {
  const result = await await_(fetch(`/api/users/${id}`).then((r) => r.json()));

  return result
    .map((data) => data as User)
    .mapErr((e) => `Failed to fetch user: ${e.message}`);
}
```

## License

MIT
