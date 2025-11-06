import type { ResultFoundation } from "../foundation";
import { Result, result } from "../implementation";
import { try_ } from "./try";

export function map<E, T, UT, UE extends E>(
  this: ResultFoundation<E, T>,
  fn: (value: T) => UT
): Result<UE | E, UT> {
  if (this.isSuccess) {
    return try_<UE, UT>(() => fn(this.value));
  }

  return result<E, UT>(null as UT, this.error);
}
