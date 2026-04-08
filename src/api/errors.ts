export class TriedToUnwrapAnNotOkResultError extends Error {
  constructor() {
    super("Tried to unwrap an Err result");
    this.name = "TriedToUnwrapAnNotOkResultError";
  }
}

export class TriedToUnwrapErrAnOkResultError extends Error {
  constructor() {
    super("Tried to unwrapErr an Ok result");
    this.name = "TriedToUnwrapErrAnOkResultError";
  }
}
