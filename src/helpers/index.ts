import crypto from "crypto";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Time, VoteFromDB } from "../models/poll";

dayjs.extend(localizedFormat);

export const isTimePresentInPollTimes = (
  timeToSearch: Time,
  times: Time[]
): boolean => {
  return times.some(
    (time) => time.start === timeToSearch.start && time.end === timeToSearch.end
  );
};

export const slotCheckClassName = (time: Time, times: Time[]): string => {
  if (isTimePresentInPollTimes(time, times)) {
    if (
      times.find(
        (currentTime) =>
          currentTime.start === time.start && currentTime.end === time.end
      )?.ifNeedBe
    )
      return "poll-slot-checked-if-need-be";
    return "poll-slot-checked";
  }
  return "poll-slot-unchecked";
};

export const isTimeIfNeedBe = (time: Time, times: Time[]): boolean => {
  if (isTimePresentInPollTimes(time, times)) {
    if (
      times.find(
        (currentTime) =>
          currentTime.start === time.start && currentTime.end === time.end
      )?.ifNeedBe
    )
      return true;
    return false;
  }
  return false;
};

export const slotTimeClassName = (
  time: Time,
  voteTimes: Time[],
  finalTime?: Time
): string => {
  if (time.start === finalTime?.start && time.end === finalTime?.end)
    return "slot-time slot-final-time";

  if (isTimePresentInPollTimes(time, voteTimes)) {
    if (
      voteTimes.find(
        (currentTime) =>
          currentTime.start === time.start && currentTime.end === time.end
      )?.ifNeedBe
    )
      return "slot-time slot-if-need-be-time";
    return "slot-time slot-normal-time";
  }
  return "slot-time";
};

export const isUserPresentInVotes = (
  userToSearch: string,
  votes: VoteFromDB[]
): boolean => {
  return votes.some((vote) => vote.name === userToSearch);
};

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
const ENCRYPTION_IV = process.env.NEXT_PUBLIC_ENCRYPTION_IV || "";

const getEncryptionConfig = (): { key: Buffer; iv: string } => {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error(
      "NEXT_PUBLIC_ENCRYPTION_KEY must be exactly 32 characters. Update the value and rebuild the app."
    );
  }

  if (ENCRYPTION_IV.length !== 16) {
    throw new Error(
      "NEXT_PUBLIC_ENCRYPTION_IV must be exactly 16 characters. Update the value and rebuild the app."
    );
  }

  return {
    key: Buffer.from(ENCRYPTION_KEY),
    iv: ENCRYPTION_IV,
  };
};

export const encrypt = (text: string): string => {
  const { key, iv } = getEncryptionConfig();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decrypt = (text: string): string => {
  const { key, iv } = getEncryptionConfig();
  const encryptedText = Buffer.from(text, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const isDayAndMonthSame = (
  firstTime: Time,
  secondTime: Time
): boolean => {
  if (
    dayjs(firstTime.start).format("D") ===
      dayjs(secondTime.start).format("D") &&
    dayjs(firstTime.start).format("MMM") ===
      dayjs(secondTime.start).format("MMM")
  ) {
    return true;
  }
  return false;
};
