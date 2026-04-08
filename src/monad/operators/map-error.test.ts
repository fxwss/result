import { describe, expect, test } from 'bun:test'

import { err, ok } from '../implementation'
import { mapErr } from '../operators/map-error'

describe('map error operator', () => {
	test('should map an Err result', () => {
		const result = err('error')
		const mapped = mapErr(result, (e) => `mapped: ${e}`)

		expect(mapped.kind).toBe('err')
		expect(mapped.error).toBe('mapped: error')
	})

	test('should not map an Ok result', () => {
		const result = ok(2)
		const mapped = mapErr(result, (e) => `mapped: ${e}`)

		expect(mapped.kind).toBe('ok')
		expect(mapped.value).toBe(2)
	})
})
