import type { ResultFoundation } from "#/monads/result/foundation";

export class ResultNotOkError<E, T> extends Error {
  constructor(
    public readonly result?: ResultFoundation<E, T>,
    message?: string
  ) {
    super(message ?? "Tried to unwrap a Result that is not ok.");
    this.name = "ResultNotOkError";
  }
}

export function unwrap<E, T>(this: ResultFoundation<E, T>): T {
  if (this.isSuccess) {
    return this.value;
  }

  if (this.error instanceof Error) {
    throw this.error;
  }

  if (typeof this.error === "string") {
    throw new ResultNotOkError<E, T>(this, this.error);
  }

  throw new ResultNotOkError<E, T>(this);
}
