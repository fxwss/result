type ResultIdentifier = {
  readonly __isResult?: unique symbol;
};

type OkResult<T> = {
  readonly status: "ok";

  readonly isSuccess: true;
  readonly isErr: false;

  readonly value: T;
  readonly error?: undefined;
} & ResultIdentifier;

type ErrResult<E> = {
  readonly status: "err";

  readonly isSuccess: false;
  readonly isErr: true;
  readonly value?: undefined;
  readonly error: E;
} & ResultIdentifier;

export type ResultFoundation<E, T> = OkResult<T> | ErrResult<E>;
