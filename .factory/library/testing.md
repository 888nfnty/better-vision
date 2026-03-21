# Testing

Project test tooling facts for this repo:

- `npm run test` runs Jest.
- `jest.config.ts` uses `preset: "ts-jest"` with `testEnvironment: "jsdom"`.
- The `@/` alias is mapped in Jest through `moduleNameMapper`.
- DOM assertions come from `jest.setup.ts`, which is loaded via `setupFilesAfterEnv`.
- Test files currently live under `src/**/__tests__`.
