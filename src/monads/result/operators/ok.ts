import { result } from "../implementation";

export const ok = <E, T>(value: T) => result<E, T>(value, null);
