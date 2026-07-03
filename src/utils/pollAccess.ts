import { PollFromDB, PublicTimeCount, TimeFromDB } from "../models/poll";

export type SessionWithUserId = {
  user?: {
    id?: string;
    sub?: string;
    email?: string | null;
    name?: string | null;
  };
} | null;

export const getSessionUserId = (session: SessionWithUserId): string | null => {
  return session?.user?.id || session?.user?.sub || null;
};

export const serializePollForViewer = (
  poll: PollFromDB,
  viewerId: string | null
): Partial<PollFromDB> => {
  const occupiedTimes = getOccupiedTimes(poll);
  const publicTimeCounts = getPublicTimeCounts(poll);

  if (viewerId && poll.ownerId === viewerId) {
    return {
      ...poll,
      occupiedTimes,
      publicTimeCounts,
    };
  }

  if (poll.resultsVisibility === "votes") {
    const {
      secret,
      ownerId,
      ownerEmail,
      ownerName,
      ...publicPoll
    } = poll;

    return {
      ...publicPoll,
      occupiedTimes,
      publicTimeCounts,
    };
  }

  const {
    secret,
    votes,
    finalTime,
    ownerId,
    ownerEmail,
    ownerName,
    ...publicPoll
  } = poll;

  return {
    ...publicPoll,
    occupiedTimes,
    publicTimeCounts,
  };
};

export const getPublicTimeCounts = (poll: PollFromDB): PublicTimeCount[] => {
  return poll.times.map((time: TimeFromDB) => {
    const counts = {
      start: time.start,
      end: time.end,
      yes: 0,
      ifNeedBe: 0,
      total: 0,
    };

    poll.votes?.forEach((vote) => {
      const voteTime = vote.times.find(
        (currentTime) =>
          currentTime.start === time.start && currentTime.end === time.end
      );

      if (!voteTime) {
        return;
      }

      if (voteTime.ifNeedBe) {
        counts.ifNeedBe += 1;
      } else {
        counts.yes += 1;
      }

      counts.total += 1;
    });

    return counts;
  });
};

const getOccupiedTimes = (poll: PollFromDB): TimeFromDB[] => {
  const occupiedTimesBySlot = new Map<string, TimeFromDB>();

  poll.votes?.forEach((vote) => {
    const time = vote.times[0];

    if (time) {
      occupiedTimesBySlot.set(`${time.start}-${time.end}`, {
        start: time.start,
        end: time.end,
      } as TimeFromDB);
    }
  });

  return Array.from(occupiedTimesBySlot.values());
};

export const serializeOwnedPoll = (
  poll: PollFromDB,
  decodeSecret: (secret: string) => string
): Partial<PollFromDB> & { adminPath: string } => {
  return {
    ...poll,
    adminPath: `/poll/${poll._id}/${decodeSecret(poll.secret)}`,
  };
};
