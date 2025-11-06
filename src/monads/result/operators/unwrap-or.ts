import type { ResultFoundation } from "../foundation";

export function unwrapOr<E, T>(
  this: ResultFoundation<E, T>,
  defaultValue: T
): T {
  if (this.isSuccess) {
    return this.value;
  }

  return defaultValue;
}
