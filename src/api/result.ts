import {
  ResultBrand,
  type Result as ResultFoundation,
} from "../monad/foundation";
import { err as err_, ok as ok_ } from "../monad/implementation";
import { flatMap } from "../monad/operators/flat-map";
import { inspect as inspect_ } from "../monad/operators/inspect";

// operators
import { map } from "../monad/operators/map";
import { mapErr } from "../monad/operators/map-error";
import { match } from "../monad/operators/match";
import { pick as pick_ } from "../monad/operators/pick";
import {
  TriedToUnwrapAnNotOkResultError,
  TriedToUnwrapErrAnOkResultError,
} from "./errors";

interface MatchParams<T, E, U> {
  ok: (value: T) => U;
  err: (error: E) => U;
}

export interface Result<T, E> {
  readonly kind: "ok" | "err";
  readonly value: T | undefined;
  readonly error: E | undefined;

  map: <U>(fn: (value: T) => U) => Result<U, E>;
  flatMap: <U, F>(fn: (value: T) => Result<U, F>) => Result<U, E | F>;
  mapErr: <F>(fn: (error: E) => F) => Result<T, F>;
  inspect: (fn: (value: T) => void) => Result<T, E>;
  pick: <K extends keyof T>(key: K) => Result<T[K], E>;
  match: <U>(handlers: MatchParams<T, E, U>) => U;
  unwrap: () => T;
  unwrapOr: (defaultValue: T) => T;
  unwrapErr: () => E;
  isOk: () => this is OkResult<T, E>;
  isErr: () => this is ErrResult<T, E>;

  // interop (functional world)
  toFoundation: () => ResultFoundation<T, E>;
}

export interface OkResult<T, E> extends Result<T, E> {
  readonly kind: "ok";
  readonly value: T;
  readonly error: never;
}

export interface ErrResult<T, E> extends Result<T, E> {
  readonly kind: "err";
  readonly value: never;
  readonly error: E;
}

class ResultImpl<T, E> implements Result<T, E> {
  readonly [ResultBrand] = true;
  readonly kind: "ok" | "err";
  private readonly result: ResultFoundation<T, E>;

  constructor(result: ResultFoundation<T, E>) {
    this.result = result;
    this.kind = result.kind;
  }

  get value(): T {
    if (this.result.kind === "err") {
      throw new TriedToUnwrapAnNotOkResultError();
    }

    return this.result.value;
  }

  get error(): E {
    if (this.result.kind === "ok") {
      throw new TriedToUnwrapErrAnOkResultError();
    }

    return this.result.error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return wrap(map(this.result, fn));
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    const mapped = flatMap<T, U, E, F>(this.result, (v) =>
      fn(v).toFoundation(),
    );
    return wrap(mapped);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return wrap(mapErr(this.result, fn));
  }

  inspect(fn: (value: T) => void): Result<T, E> {
    inspect_(this.result, fn);
    return this;
  }

  pick<K extends keyof T>(key: K): Result<T[K], E> {
    return wrap(pick_(this.result, key));
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

  unwrapErr(): E {
    if (this.result.kind === "ok") {
      throw new TriedToUnwrapErrAnOkResultError();
    }
    return this.result.error;
  }

  isOk(): this is OkResult<T, E> {
    return this.result.kind === "ok";
  }

  isErr(): this is ErrResult<T, E> {
    return this.result.kind === "err";
  }

  // interop (functional world)
  toFoundation(): ResultFoundation<T, E> {
    return this.result;
  }
}

function wrap<T, E>(result: ResultFoundation<T, E>): Result<T, E> {
  return new ResultImpl(result);
}

function dealWithError<T>(error: unknown): Result<T, Error> {
  if (error instanceof Error) {
    return err(error);
  }

  if (typeof error === "string") {
    return err(new Error(error));
  }

  return err(new Error("Unknown error"));
}

export const ok = <T, E = never>(value: T): Result<T, E> =>
  new ResultImpl(ok_(value));

export const err = <T = never, E = unknown>(error: E): Result<T, E> =>
  new ResultImpl<T, E>(err_<E, T>(error));

export function try_<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    return dealWithError(error);
  }
}

export function await_<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  return new Promise((resolve) => {
    promise
      .then((value) => resolve(ok(value)))
      .catch((error) => resolve(dealWithError(error)));
  });
}

export const fromFoundation = <T, E>(
  result: ResultFoundation<T, E>,
): Result<T, E> => new ResultImpl(result);
