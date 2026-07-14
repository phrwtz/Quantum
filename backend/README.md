# Qubit Lab Backend Skeleton

This is the Stage 5 backend skeleton for the distributed Qubit Lab. It is intentionally small and dependency-free so the protocol model can evolve before we add durable storage, authentication, and realtime sync.

## Local Run

```sh
npm run backend
```

By default the API listens on `http://127.0.0.1:8787`. Render will provide `PORT` in production.

## Mail Delivery

Mailbox transfers and teleport invites use a local `mailto:` draft unless real delivery is configured.
On Render, set these environment variables on the backend service:

- `MAIL_DELIVERY_PROVIDER=resend`
- `MAIL_FROM`: a verified sender address or domain in Resend, for example `Qubit Lab <send@your-domain.example>`
- `RESEND_API_KEY`: the secret Resend API key
- `MAIL_REPLY_TO`: optional reply-to address
- `PUBLIC_APP_URL`: the public frontend URL used when the backend has to build links
- `MAIL_SEND_TIMEOUT_MS`: optional Resend request timeout in milliseconds; defaults to `10000`

The address typed in the mailbox `From:` field, or the participant that created a teleport invite, is included in the message body. The actual email sender is always `MAIL_FROM`, because providers reject unverified sender domains.

## Render Deployment

`render.yaml` defines two services:

- `qubit-lab`: a static site built with `npm run build:static`.
- `qubit-lab-backend`: a Node web service running `npm run backend`.

Set `PUBLIC_BACKEND_URL` on the static site to the public backend service URL. Set `PUBLIC_APP_URL` on the backend to the public static site URL.

## Current API Surface

- `GET /health` reports backend availability.
- `GET /version` reports the package name and version.
- `GET /rooms` lists in-memory lab rooms.
- `POST /rooms` creates a room.
- `POST /rooms/:roomId/auto-join` joins the fixed Entanglement 3 room as Bob first, then Alice.
- `GET /rooms/:roomId` fetches a room with registers, entanglement groups, and events.
- `DELETE /rooms/:roomId?requestedBy=:participantId` removes a stale room when requested by its owner.
- `POST /rooms/:roomId/reset` clears mutable collaboration state and room events while keeping participants in the room.
- `GET /rooms/:roomId/registers/:registerId` fetches a single shared register.
- `POST /rooms/:roomId/registers` creates a register.
- `PUT /rooms/:roomId/registers/:registerId` creates or replaces a named register.
- `POST /rooms/:roomId/entanglement-groups` records a group of two or more qubits that should be treated as entangled.
- `POST /rooms/:roomId/shared-entanglements` creates a versioned shared entangled register across mailbox participants. Include `numQubits` for registers larger than two qubits.
- `GET|PUT /rooms/:roomId/shared-entanglements/:entanglementId` reads or updates that distributed register, including measurement separation.
- `GET /rooms/:roomId/measurements` lists distributed room measurement counts.
- `POST /rooms/:roomId/measurements/:measurementId` records one participant's measured qubit for a distributed room measurement.
- `POST /rooms/:roomId/measurements/:measurementId/control` broadcasts a recorded-experiment repeat or B-count change for that distributed measurement.
- `GET /rooms/:roomId/distributed-teleportation/:protocolId` fetches a distributed teleportation protocol record.
- `PUT /rooms/:roomId/distributed-teleportation/:protocolId` creates or updates a distributed teleportation protocol record.
- `POST /rooms/:roomId/teleport-invites` creates a mailbox-style teleport invite for a register qubit and email address.
- `POST /rooms/:roomId/mailbox-transfers` creates a mailbox transfer containing a snapshot of the source register and selected qubit.
- `GET /teleport-invites/:token` resolves an invite token.
- `POST /teleport-invites/:token/accept` marks an invite as accepted.
- `GET /mailbox-transfers/:token` resolves a mailbox transfer token.
- `POST /mailbox-transfers/:token/claim` claims a mailbox transfer and returns the register snapshot.
- `GET /rooms/:roomId/events` returns the room event log.
- `POST /rooms/:roomId/messages` appends a lightweight room chat message to the event log.
- `POST /rooms/:roomId/actions` appends a structured experiment action such as a flipper-gate setting change.
- `POST /rooms/:roomId/mailbox-notifications` queues a qubit notification such as “Bob sent q0” and appends it to the room event log.
- `GET /rooms/:roomId/mailbox-notifications?participantId=:participantId` returns unclaimed queued qubits for a participant, including qubits sent before they joined.
- `POST /rooms/:roomId/mailbox-notifications/:eventId/claim` marks a queued qubit as delivered.

## Deliberate Stage 5 Limits

- State is in memory and resets when the server restarts.
- Mailbox transfer and teleport invite email delivery is real when Render has Resend credentials; otherwise responses include a local draft link.
- There is no authentication or authorization yet.
- Register amplitudes are validated and stored, but no server-side quantum operations run yet.
- Mailbox transfer preserves a register snapshot; later stages can replace that with durable distributed entanglement ownership.
- Room mailbox notifications retain their transfer snapshots until a receiving participant claims them.
- Register writes carry monotonically increasing `version` values. Clients can pass `expectedVersion` on `PUT /rooms/:roomId/registers/:registerId` to reject stale writes with `register_version_conflict`.
- Local Lab Stage 7 sync uses short polling instead of WebSockets; WebSockets can replace polling once the shared-register model settles.
- Distributed teleportation protocol records coordinate Bob's Bell-pair/mailbox step, Alice's classical bits, Bob's correction, and final fidelity verification.
