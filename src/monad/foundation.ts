export const ResultBrand: unique symbol = Symbol('Result')

export interface OkResult<T> {
	readonly [ResultBrand]: true
	readonly kind: 'ok'
	readonly value: T
	readonly error?: never
}

export interface ErrResult<E> {
	readonly [ResultBrand]: true
	readonly kind: 'err'
	readonly value?: never
	readonly error: E
}

export type Result<T, E> = OkResult<T> | ErrResult<E>
