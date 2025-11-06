import { err } from "./err";
import { ok } from "./ok";
import type { Result } from "../implementation";
import { isResult } from "./is-result";

export const try_ = <E, T>(fn: () => T | Result<E, T>) => {
  try {
    const r = fn();

    if (isResult(r)) {
      return r;
    }

    return ok<E, T>(r as T);
  } catch (error) {
    return err<E, T>(error as E);
  }
};
