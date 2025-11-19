import type { Result } from "./foundation";

export const ok = <T>(value: T): Result<T, never> => ({
  kind: "ok" as const,
  value,
  error: undefined as never,
});

export const err = <E = unknown, T = never>(error: E): Result<T, E> => ({
  kind: "err" as const,
  error,
  value: undefined as never,
});
