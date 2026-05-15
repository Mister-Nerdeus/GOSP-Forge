# Branch Protection Recommendations

| Branch | Recommended requirements |
| --- | --- |
| develop | Pull request required; CI must pass before merge. |
| staging | Pull request required; CI, validation examples, simulation, estimate, and audit gates must pass. |
| main | Pull request review required; CI must pass; release evidence and human promotion review required. |

Recommended status checks: lint, recursive build, recursive typecheck, recursive test, validate examples, clean-water simulation, clean-water estimate, audit, and local validation currentness where applicable.

These are recommendations unless repository settings are separately verified.
