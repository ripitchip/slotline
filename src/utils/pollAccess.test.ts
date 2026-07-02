import assert from "assert";
import {
  getSessionUserId,
  serializeOwnedPoll,
  serializePollForViewer,
} from "./pollAccess";

const poll: any = {
  _id: "poll-1",
  title: "Planning",
  description: "Weekly sync",
  location: "Room 1",
  open: false,
  secret: "encrypted-secret",
  ownerId: "user-1",
  ownerEmail: "owner@example.com",
  ownerName: "Owner",
  type: "group",
  times: [{ start: 1, end: 2 }],
  votes: [
    { name: "Alice", times: [{ start: 1, end: 2 }] },
    { name: "Bob", times: [{ start: 1, end: 2, ifNeedBe: true }] },
  ],
  finalTime: { start: 1, end: 2 },
  createdAt: "2026-07-02T00:00:00.000Z",
  updatedAt: "2026-07-02T00:00:00.000Z",
  __v: 0,
};

const anonymousView = serializePollForViewer(poll, null);

assert.strictEqual(anonymousView.secret, undefined);
assert.strictEqual(anonymousView.votes, undefined);
assert.strictEqual(anonymousView.finalTime, undefined);
assert.deepStrictEqual(anonymousView.times, poll.times);
assert.deepStrictEqual(anonymousView.occupiedTimes, [{ start: 1, end: 2 }]);
assert.deepStrictEqual(anonymousView.publicTimeCounts, [
  { start: 1, end: 2, yes: 1, ifNeedBe: 1, total: 2 },
]);

const ownerView = serializePollForViewer(poll, "user-1");

assert.deepStrictEqual(ownerView.votes, poll.votes);
assert.deepStrictEqual(ownerView.finalTime, poll.finalTime);
assert.deepStrictEqual(ownerView.publicTimeCounts, [
  { start: 1, end: 2, yes: 1, ifNeedBe: 1, total: 2 },
]);

const ownedPoll = serializeOwnedPoll(poll, (secret) =>
  secret.replace("encrypted", "plain")
);

assert.strictEqual(ownedPoll.adminPath, "/poll/poll-1/plain-secret");

assert.strictEqual(
  getSessionUserId({ user: { id: "user-1" } } as any),
  "user-1"
);
assert.strictEqual(
  getSessionUserId({ user: { sub: "user-2" } } as any),
  "user-2"
);
assert.strictEqual(getSessionUserId(null), null);
