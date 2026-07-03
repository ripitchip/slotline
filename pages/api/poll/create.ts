import { NextApiRequest, NextApiResponse } from "next";
import SamayPoll, { PollDoc } from "../../../src/models/poll";
import { getSessionUserId } from "../../../src/utils/pollAccess";
import { getApiSession } from "../../../src/utils/auth";
import connectToDatabase from "../../../src/utils/db";

const getRequestId = (req: NextApiRequest): string => {
  const header = req.headers["x-slotline-request-id"];

  if (Array.isArray(header)) {
    return header[0] || "missing-request-id";
  }

  return header || "missing-request-id";
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method, body } = req;
  const requestId = getRequestId(req);
  const startedAt = Date.now();

  switch (method) {
    case "POST":
      try {
        console.info("Poll creation API request received", {
          requestId,
          method,
          contentType: req.headers["content-type"] || null,
          bodyType: typeof body,
          bodyLength: typeof body === "string" ? body.length : null,
          encryptionKeyLength:
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.length || 0,
          encryptionIvLength: process.env.NEXT_PUBLIC_ENCRYPTION_IV?.length || 0,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || null,
          nextauthUrl: process.env.NEXTAUTH_URL || null,
          hasMongoUri: Boolean(process.env.NEXT_MONGODB_URI),
        });

        const session = await getApiSession(req, res);
        const ownerId = getSessionUserId(session);

        console.info("Poll creation auth checked", {
          requestId,
          hasSession: Boolean(session),
          hasUser: Boolean(session?.user),
          hasOwnerId: Boolean(ownerId),
        });

        if (!ownerId) {
          console.warn("Poll creation rejected: missing authenticated user", {
            requestId,
            durationMs: Date.now() - startedAt,
          });
          res.status(401).json({
            message: "Authentication required",
            requestId,
          });
          return;
        }

        console.info("Poll creation connecting to database", { requestId });
        await connectToDatabase();
        console.info("Poll creation database connected", {
          requestId,
          durationMs: Date.now() - startedAt,
        });

        const poll = JSON.parse(body);
        console.info("Poll creation payload parsed", {
          requestId,
          timesCount: Array.isArray(poll.times) ? poll.times.length : null,
          pollType: poll.type || null,
          titleLength: poll.title?.length || 0,
          descriptionLength: poll.description?.length || 0,
          locationLength: poll.location?.length || 0,
          hasSecret: Boolean(poll.secret),
          encryptedSecretLength: poll.secret?.length || 0,
        });

        const newPoll: PollDoc = new SamayPoll({
          ...poll,
          ownerId,
          ownerEmail: session.user?.email || undefined,
          ownerName: session.user?.name || undefined,
        });
        await newPoll.save();
        console.info("Poll creation saved", {
          requestId,
          pollId: newPoll._id,
          durationMs: Date.now() - startedAt,
        });
        res.status(201).json(newPoll);
      } catch (err) {
        console.error("Poll creation failed", {
          requestId,
          durationMs: Date.now() - startedAt,
          errorName: err?.name,
          errorMessage: err?.message,
          errorStack: err?.stack,
        });
        res.status(400).json({
          message: err.message,
          requestId,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
