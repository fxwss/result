import type { Result } from "./foundation";
import { ResultBrand } from "./foundation";

export const ok = <T = void>(value: T): Result<T, never> => ({
  [ResultBrand]: true,
  kind: "ok" as const,
  value,
});

export const err = <E = unknown, T = never>(error: E): Result<T, E> => ({
  [ResultBrand]: true,
  kind: "err" as const,
  error,
});
