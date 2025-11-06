import { result } from "../implementation";

export const err = <E, T = void>(error: E) => result<E, T>(null as T, error);
