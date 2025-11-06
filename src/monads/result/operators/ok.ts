import { result } from "../implementation";

export const ok = <E, T = void>(value?: T) => result<E, T>(value as T, null);
