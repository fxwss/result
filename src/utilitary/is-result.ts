import { type Result, ResultBrand } from '../monad/foundation'

export const isResult = <T = unknown, E = unknown>(value: unknown): value is Result<T, E> =>
	typeof value === 'object' &&
	value !== null &&
	ResultBrand in value &&
	(value as Record<string, unknown>).kind !== undefined
