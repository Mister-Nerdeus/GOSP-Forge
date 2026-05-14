# Graph Contracts

GOSP Forge graph contracts are data contracts. They describe resource, power, and control relationships for validation, inspection, simulation input compilation, and education. They do not execute code and do not certify real-world safety or performance.

## Shared Rules

All graph contracts require:

- unique node IDs
- unique edge IDs
- edges that reference existing node IDs
- a project ID
- explicit graph kind

## Graph Kinds

- `ResourceFlowGraph`: resource movement such as water, air, or material.
- `PowerFlowGraph`: power relationships such as low-voltage DC or manually powered systems.
- `ControlFlowGraph`: control relationships such as manual, logic, or sensor-feedback behavior.

## Non-Claims

Graph validity means the graph file is internally consistent as data. It does not mean the represented system is potable-water safe, professionally engineered, electrically approved, production-manufacturing ready, or field verified.
