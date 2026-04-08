import type { Result } from "../foundation";
import { err, ok } from "../implementation";

// pick: Result<A, E> + keyof A => Result<A[K], E>
export const pick = <T, K extends keyof T, E>(
  result: Result<T, E>,
  key: K,
): Result<T[K], E> => {
  if (result.kind === "err") {
    return err<E>(result.error);
  }

  return ok(result.value[key]);
};
