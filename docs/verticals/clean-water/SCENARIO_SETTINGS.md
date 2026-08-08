# Clean Water Scenario Compatibility Settings

The legacy Clean Water project adapter reads:

- `scenarioSettings.cleanWater.sourceLiters`
- `scenarioSettings.cleanWater.runMinutes`

Both values must be positive numbers when supplied. They remain a compatibility extension owned by `@gosp/vertical-clean-water`; generic GOSP contracts preserve but do not interpret the extension.

The adapter exposes missing or defaulted values and makes no potable-water or professional-use claim.
