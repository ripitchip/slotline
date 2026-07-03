import { Dispatch } from "react";
import { Table } from "react-bootstrap";
import { CheckCircleFill, CircleFill, PersonFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import MarkTimes from "./MarkTimes";
import MarkTimesOneOnOne from "./MarkTimesOneOnOne";
import PollDateTime from "./PollDateTime";
import { Time, PollFromDB, Vote } from "../../models/poll";
import {
  isTimeIfNeedBe,
  isTimePresentInPollTimes,
  slotCheckClassName,
} from "../../helpers";

dayjs.extend(localizedFormat);

const PollTableVoter = (props: {
  pollFromDB: PollFromDB;
  sortedTimes: Time[];
  newVote: Vote;
  setNewVote: Dispatch<Vote>;
}): JSX.Element => {
  const { pollFromDB, sortedTimes, newVote, setNewVote } = props;

  const visibility = pollFromDB.resultsVisibility || "votes";
  const votes = pollFromDB.votes || [];

  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
            {visibility === "votes" && (
              <th className="poll-participant-cell"> </th>
            )}
            {(!pollFromDB.type || pollFromDB.type === "group") &&
              sortedTimes.map((time, i) => (
                <th key={JSON.stringify(time)} className="poll-slot-time">
                  <PollDateTime
                    time={time}
                    type="voter"
                    index={i}
                    times={sortedTimes}
                  />
                </th>
              ))}
            {pollFromDB.type === "oneonone" &&
              sortedTimes.map((time, i) => (
                <th key={JSON.stringify(time)} className="poll-slot-time">
                  <PollDateTime
                    time={time}
                    type="voter"
                    index={i}
                    times={sortedTimes}
                  />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {visibility !== "nothing" && (
            <tr>
              {visibility === "votes" && (
                <td className="poll-table-total-participants">
                  {pollFromDB.type === "group"
                    ? votes.length + 1
                    : votes.length}
                  &nbsp; &nbsp;
                  {pollFromDB.type === "oneonone" && votes.length === 1
                    ? "PARTICIPANT"
                    : "PARTICIPANTS"}
                </td>
              )}
              {sortedTimes.map((time: Time) => (
                <td key={JSON.stringify(time)} className={visibility === "votes" ? "poll-slot-total-votes" : "poll-public-count-cell"}>
                  {visibility === "votes" ? (
                    votes.filter((vote: Vote) =>
                      isTimePresentInPollTimes(time, vote.times)
                    ).length !== 0 && (
                      <span>
                        <PersonFill className="poll-total-votes-icon" />
                        {pollFromDB.type === "group"
                          ? votes.filter((vote: Vote) =>
                              isTimePresentInPollTimes(time, vote.times)
                            ).length + 1
                          : votes.filter((vote: Vote) =>
                              isTimePresentInPollTimes(time, vote.times)
                            ).length}
                      </span>
                    )
                  ) : (
                    <span className="poll-public-count">
                      <PersonFill className="poll-public-count-icon" />
                      {(() => {
                        const count = pollFromDB.publicTimeCounts?.find(
                          (currentCount) =>
                            currentCount.start === time.start && currentCount.end === time.end
                        );
                        if (!count || count.total === 0) return "0 votes";
                        if (count.ifNeedBe > 0) return `${count.yes} yes, ${count.ifNeedBe} maybe`;
                        return `${count.yes} yes`;
                      })()}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          )}
          {visibility === "votes" &&
            votes.map((vote: Vote, idx: number) => (
              <tr key={`${idx}-${vote.name}`}>
                <td className="poll-table-participants">{vote.name}</td>
                {sortedTimes.map((time: Time) => (
                  <td
                    key={JSON.stringify(time)}
                    className={slotCheckClassName(time, vote.times)}
                  >
                    {isTimeIfNeedBe(time, vote.times) ? (
                      <CircleFill className="poll-slot-check" />
                    ) : (
                      <CheckCircleFill className="poll-slot-check" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          {visibility === "votes" && pollFromDB.type === "group" && (
            <tr>
              <td className="poll-table-participants">You</td>
              {sortedTimes.map((time: Time) => (
                <td key={JSON.stringify(time)} className="poll-slot-checked">
                  <CheckCircleFill className="poll-slot-check" />
                </td>
              ))}
            </tr>
          )}
          {pollFromDB.open &&
            (!pollFromDB.type || pollFromDB.type === "group") && (
              <MarkTimes
                times={sortedTimes}
                newVote={newVote}
                setNewVote={setNewVote}
                hasParticipantColumn={visibility === "votes"}
              />
            )}
          {pollFromDB.open && pollFromDB.type === "oneonone" && (
            <MarkTimesOneOnOne
              times={sortedTimes}
              newVote={newVote}
              poll={pollFromDB}
              setNewVote={setNewVote}
              hasParticipantColumn={visibility === "votes"}
            />
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PollTableVoter;
