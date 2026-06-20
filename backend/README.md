# Qubit Lab Backend Skeleton

This is the Stage 5 backend skeleton for the distributed Qubit Lab. It is intentionally small and dependency-free so the protocol model can evolve before we add durable storage, authentication, realtime sync, or real email delivery.

## Local Run

```sh
npm run backend
```

By default the API listens on `http://127.0.0.1:8787`. Render will provide `PORT` in production.

## Current API Surface

- `GET /health` reports backend availability.
- `GET /version` reports the package name and version.
- `GET /rooms` lists in-memory lab rooms.
- `POST /rooms` creates a room.
- `GET /rooms/:roomId` fetches a room with registers, entanglement groups, and events.
- `GET /rooms/:roomId/registers/:registerId` fetches a single shared register.
- `POST /rooms/:roomId/registers` creates a register.
- `PUT /rooms/:roomId/registers/:registerId` creates or replaces a named register.
- `POST /rooms/:roomId/entanglement-groups` records a group of two or more qubits that should be treated as entangled.
- `GET /rooms/:roomId/distributed-teleportation/:protocolId` fetches a distributed teleportation protocol record.
- `PUT /rooms/:roomId/distributed-teleportation/:protocolId` creates or updates a distributed teleportation protocol record.
- `POST /rooms/:roomId/teleport-invites` creates a mailbox-style teleport invite for a register qubit and email address.
- `POST /rooms/:roomId/mailbox-transfers` creates a mailbox transfer containing a snapshot of the source register and selected qubit.
- `GET /teleport-invites/:token` resolves an invite token.
- `POST /teleport-invites/:token/accept` marks an invite as accepted.
- `GET /mailbox-transfers/:token` resolves a mailbox transfer token.
- `POST /mailbox-transfers/:token/claim` claims a mailbox transfer and returns the register snapshot.
- `GET /rooms/:roomId/events` returns the room event log.

## Deliberate Stage 5 Limits

- State is in memory and resets when the server restarts.
- Email delivery is stubbed; invite responses include the link that a future mailer would send.
- There is no authentication or authorization yet.
- Register amplitudes are validated and stored, but no server-side quantum operations run yet.
- Mailbox transfer preserves a register snapshot; later stages can replace that with durable distributed entanglement ownership.
- Register writes carry monotonically increasing `version` values. Clients can pass `expectedVersion` on `PUT /rooms/:roomId/registers/:registerId` to reject stale writes with `register_version_conflict`.
- Local Lab Stage 7 sync uses short polling instead of WebSockets; WebSockets can replace polling once the shared-register model settles.
- Distributed teleportation protocol records coordinate Bob's Bell-pair/mailbox step, Alice's classical bits, Bob's correction, and final fidelity verification.
