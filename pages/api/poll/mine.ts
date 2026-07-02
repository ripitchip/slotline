import { NextApiRequest, NextApiResponse } from "next";
import SamayPoll, { PollFromDB } from "../../../src/models/poll";
import { decrypt } from "../../../src/helpers";
import { getApiSession } from "../../../src/utils/auth";
import {
  getSessionUserId,
  serializeOwnedPoll,
} from "../../../src/utils/pollAccess";
import connectToDatabase from "../../../src/utils/db";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const session = await getApiSession(req, res);
        const ownerId = getSessionUserId(session);

        if (!ownerId) {
          res.status(401).json({ message: "Authentication required" });
          return;
        }

        await connectToDatabase();
        const polls: PollFromDB[] = await SamayPoll.find({ ownerId })
          .sort({ createdAt: -1 })
          .lean();

        res
          .status(200)
          .json(polls.map((poll) => serializeOwnedPoll(poll, decrypt)));
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
