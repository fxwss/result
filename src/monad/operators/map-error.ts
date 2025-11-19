import { Result } from "../foundation";
import { err } from "../implementation";

export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  if (result.kind === "ok") {
    return result;
  }

  return err<F, T>(fn(result.error));
};
