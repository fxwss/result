import { Result } from "../monad/foundation";
import { err, ok } from "../monad/implementation";

export const await_ = async <T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> => {
  try {
    const value = await promise;
    return ok<T>(value);
  } catch (error) {
    // Sempre wrappa em Error se não for Error
    const wrappedError =
      error instanceof Error ? error : new Error(String(error));
    return err<E>(wrappedError as E);
  }
};
