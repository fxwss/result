import type { Result } from "../foundation";

import { map as map_ } from "../../functors/map";
import { try_ } from "../../utilitary/try";

// map: Result<A, E> + (A => B) => Result<B, E>
export const map = <T, U, E = Error>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (result.kind === "err") {
    return result;
  }

  return try_<U, E>(() => map_(result.value, fn));
};
