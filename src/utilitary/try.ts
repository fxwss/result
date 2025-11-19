import { err, ok } from "../monad/implementation";

export function try_<T, E = Error>(fn: () => T) {
  try {
    return ok<T>(fn());
  } catch (error) {
    return err<E>(error as E);
  }
}
