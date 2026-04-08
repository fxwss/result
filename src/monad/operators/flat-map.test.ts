import { describe, expect, test } from 'bun:test'

import { err, ok } from '../implementation'
import { flatMap } from '../operators/flat-map'

describe('flat map operator', () => {
	test('should map an Ok result', () => {
		const result = ok(2)
		const mapped = flatMap(result, (x) => ok(x * 2))

		expect(mapped.kind).toBe('ok')
		expect(mapped.value).toBe(4)
	})

	test('should not map an Err result', () => {
		const result = err('error')
		const mapped = flatMap(result, (x: number) => ok(x * 2))

		expect(mapped.kind).toBe('err')
		expect(mapped.error).toBe('error')
	})

	test('should propagate exceptions in the mapping function', () => {
		const result = ok(2)

		expect(() =>
			flatMap(result, (_x) => {
				throw new Error('mapping error')
			}),
		).toThrow('mapping error')
	})
})
