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
