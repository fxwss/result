import type { Result } from "../implementation";

export const isResult = <E, T>(value: unknown): value is Result<E, T> => {
  if (typeof value !== "object") {
    return false;
  }

  return value !== null && "__isResult" in value;
};
