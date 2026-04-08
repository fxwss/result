import type { Result } from "../foundation";

// inspect: Result<A, E> + (A => void) => Result<A, E>
export const inspect = <T, E>(
  result: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> => {
  if (result.kind === "ok") {
    fn(result.value);
  }

  return result;
};
