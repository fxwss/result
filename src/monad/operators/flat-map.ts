import type { Result } from "../foundation";
import { err } from "../implementation";

// flat-map: Result<A, E> + (A => Result<B, F>) => Result<B, E | F>
export const flatMap = <T, U, E, F>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, F>,
): Result<U, E | F> => {
  if (result.kind === "err") {
    return err<E | F>(result.error);
  }

  return fn(result.value);
};
