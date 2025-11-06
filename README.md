# @fxwss/result

A TypeScript Result monad library for elegant error handling without exceptions.

## Installation

```bash
npm install @fxwss/result
# or
yarn add @fxwss/result
# or
bun add @fxwss/result
```

## Usage

```typescript
import { Result, ok, err } from "@fxwss/result";

// Create successful results
const success = ok(42);
const failure = err("Something went wrong");

// Chain operations safely
const result = ok(10)
  .map((x) => x * 2)
  .map((x) => x + 1)
  .unwrapOr(0); // Returns 21

// Handle errors gracefully
function divide(a: number, b: number): Result<string, number> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}

const safeResult = divide(10, 2)
  .map((x) => x * 2)
  .unwrapOr(0); // Returns 10
```

## API

### Creating Results

- `ok(value)` - Create a successful Result
- `err(error)` - Create an error Result

### Methods

- `map(fn)` - Transform the success value
- `unwrap()` - Get the value (throws on error)
- `unwrapOr(default)` - Get the value or return default
- `isOk()` - Check if result is successful
- `isErr()` - Check if result is an error

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the library
npm run build
```

## License

MIT
