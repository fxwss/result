import { err } from "./err";
import { ok } from "./ok";

type PromiseOrFn<T> = () => Promise<T> | Promise<T>;

const asPromise = <T>(promiseOrFn: PromiseOrFn<T>): Promise<T> => {
  if (typeof promiseOrFn === "function") {
    return promiseOrFn();
  }

  return promiseOrFn;
};

export const await_: <E, T>(
  promiseOrFn: PromiseOrFn<T>
) => Promise<import("../implementation").Result<E, T>> = async <E, T>(
  promiseOrFn: PromiseOrFn<T>
) =>
  asPromise(promiseOrFn)
    .then((r) => ok<E, T>(r))
    .catch((e) => err<E, T>(e));
