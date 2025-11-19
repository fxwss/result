import type { Result } from "../foundation";

import { map as map_ } from "../../functors/map";
import { try_ } from "../../utilitary/try";
import { isResult } from "../../utilitary/is-result";

// flat-map: Result<A, E> + (A => Result<B, F>) => Result<B, E | F>
export const flatMap = <T, U, E, F>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, F> | U
): Result<U, E | F> => {
  if (result.kind === "err") {
    return result as unknown as Result<U, E | F>;
  }

  const tryResult = try_<Result<U, F> | U, E | F>(() => map_(result.value, fn));

  if (tryResult.kind === "err") {
    return tryResult;
  }

  const mapped = tryResult.value;

  // Se o resultado já é um Result, retorna ele diretamente (achata)
  if (isResult(mapped)) {
    return mapped as Result<U, E | F>;
  }

  // Se não, wrappa em Ok
  return try_<U, E | F>(() => mapped);
};
