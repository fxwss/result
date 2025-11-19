import { Result } from "../foundation";

export const match = <T, E, U>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => U;
    err: (error: E) => U;
  }
): U => {
  if (result.kind === "ok") {
    return handlers.ok(result.value);
  }
  return handlers.err(result.error);
};
