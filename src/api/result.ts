import { Result as ResultFoundation } from "../monad/foundation";
import { err as err_, ok as ok_ } from "../monad/implementation";
import { TriedToUnwrapAnNotOkResultError } from "./errors";

// operators
import { map } from "../monad/operators/map";
import { flatMap } from "../monad/operators/flat-map";
import { mapErr } from "../monad/operators/map-error";
import { match } from "../monad/operators/match";

// utilitary
import { try_ } from "../utilitary/try";
import { await_ } from "../utilitary/await";

type MatchParams<T, E, U> = {
  ok: (value: T) => U;
  err: (error: E) => U;
};

export interface Result<T, E> {
  readonly kind: "ok" | "err";
  readonly value: T;
  readonly error: E;

  map<U>(fn: (value: T) => U): Result<U, E>;
  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  match<U>(handlers: MatchParams<T, E, U>): U;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  isOk(): this is Result<T, never>;
  isErr(): this is Result<never, E>;

  // static
  try<U>(fn: () => U): Result<U, Error>;
  await<U>(promise: Promise<U>): Promise<Result<U, Error>>;

  // interop (functional world)
  toFoundation(): ResultFoundation<T, E>;
  fromFoundation(result: ResultFoundation<T, E>): Result<T, E>;
}

class ResultImpl<T, E> implements Result<T, E> {
  constructor(private result: ResultFoundation<T, E>) {}

  get kind() {
    return this.result.kind;
  }

  get value() {
    return this.result.value;
  }

  get error() {
    return this.result.error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new ResultImpl(map(this.result, fn)) as Result<U, E>;
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    const mapped = flatMap<T, U, E, F>(this.result, (v) =>
      fn(v).toFoundation()
    );
    return new ResultImpl(mapped) as Result<U, E | F>;
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new ResultImpl(mapErr(this.result, fn)) as Result<T, F>;
  }

  match<U>(handlers: MatchParams<T, E, U>): U {
    return match(this.result, handlers);
  }

  unwrap(): T {
    if (this.result.kind === "err") {
      throw new TriedToUnwrapAnNotOkResultError();
    }
    return this.result.value;
  }

  unwrapOr(defaultValue: T): T {
    return this.result.kind === "ok" ? this.result.value : defaultValue;
  }

  isOk(): this is Result<T, never> {
    return this.result.kind === "ok";
  }

  isErr(): this is Result<never, E> {
    return this.result.kind === "err";
  }

  // static
  try<U>(fn: () => U): Result<U, Error> {
    return new ResultImpl(try_<U, Error>(fn));
  }

  async await<U>(promise: Promise<U>): Promise<Result<U, Error>> {
    const awaited = await await_(promise);
    return new ResultImpl(awaited);
  }

  // interop (functional world)
  toFoundation(): ResultFoundation<T, E> {
    return this.result;
  }

  fromFoundation(result: ResultFoundation<T, E>): Result<T, E> {
    return new ResultImpl(result);
  }
}

export const ok = <T, E = never>(value: T): Result<T, E> => {
  return new ResultImpl(ok_(value));
};

export const err = <T = never, E = unknown>(error: E): Result<T, E> => {
  return new ResultImpl(err_(error));
};

export const fromFoundation = <T, E>(
  result: ResultFoundation<T, E>
): Result<T, E> => {
  return new ResultImpl(result);
};
