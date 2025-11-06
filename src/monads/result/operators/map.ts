import type { ResultFoundation } from "../foundation";
import { result } from "../implementation";
import { try_ } from "./try";

export function map<E, T, UT, UE extends E>(
  this: ResultFoundation<E, T>,
  fn: (value: T) => UT
) {
  if (this.isSuccess) {
    return try_<UE, UT>(() => fn(this.value));
  }

  return result<E, UT>(null as UT, this.error);
}
