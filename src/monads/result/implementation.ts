import type { ResultFoundation } from "./foundation";
import * as operators from "./operators";

export type Result<E, T> = ResultFoundation<E, T> &
  typeof import("./operators");

export const identifier = Symbol("Result");

export const create =
  <E, T>(op: typeof operators) =>
  (result: ResultFoundation<E, T>): Result<E, T> =>
    Object.assign(result, op, { __isResult: identifier });

export function result<E, T>(value: T, error: E | null) {
  const m = create<E, T>(operators);

  if (error !== null) {
    return m({
      status: "err",
      isSuccess: false,
      isErr: true,
      error,
    });
  }

  return m({
    status: "ok",
    isSuccess: true,
    isErr: false,
    value,
  });
}

export const Result = {
  create,
  _: result,
  ...operators,
};
