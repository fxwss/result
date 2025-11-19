export type OkResult<T> = {
  readonly kind: "ok";
  readonly value: T;
  readonly error: never;
};

export type ErrResult<E> = {
  readonly kind: "err";
  readonly value: never;
  readonly error: E;
};

export type Result<T, E> = OkResult<T> | ErrResult<E>;
