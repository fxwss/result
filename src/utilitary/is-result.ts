import { Result } from "../monad/foundation";

export const isResult = <T, E>(value: any): value is Result<T, E> => {
  return value && (value.kind === "ok" || value.kind === "err");
};
