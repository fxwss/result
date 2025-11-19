export class TriedToUnwrapAnNotOkResultError extends Error {
  constructor() {
    super("Tried to unwrap an Err result");
    this.name = "TriedToUnwrapAnNotOkResultError";
  }
}
