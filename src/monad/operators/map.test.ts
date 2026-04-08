import { describe, expect, test } from 'bun:test'

import { err, ok } from '../implementation'
import { map } from '../operators/map'

describe('map operator', () => {
	test('should map an Ok result', () => {
		const result = ok(2)
		const mapped = map(result, (x) => x * 2)

		expect(mapped.kind).toBe('ok')
		expect(mapped.value).toBe(4)
	})

	test('should wrap result if fn returns Result', () => {
		const result = ok(2)
		const mapped = map(result, (x) => ok(x * 2))

		expect(mapped.kind).toBe('ok')
		// map doesn't flatten — the value is the Result itself
		expect(mapped.value).toEqual(ok(4))
	})

	test('should not map an Err result', () => {
		const result = err('error')
		const mapped = map(result, (x: number) => x * 2)

		expect(mapped.kind).toBe('err')
		expect(mapped.error).toBe('error')
	})

	test('should propagate exceptions in the mapping function', () => {
		const result = ok(2)

		expect(() =>
			map(result, (_x) => {
				throw new Error('mapping error')
			}),
		).toThrow('mapping error')
	})
})
