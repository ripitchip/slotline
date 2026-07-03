import { Dispatch } from "react";
import { Table } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import MarkTimes from "./MarkTimes";
import MarkTimesOneOnOne from "./MarkTimesOneOnOne";
import PollDateTime from "./PollDateTime";
import { Time, PollFromDB, Vote } from "../../models/poll";

dayjs.extend(localizedFormat);

const PollTableVoter = (props: {
  pollFromDB: PollFromDB;
  sortedTimes: Time[];
  newVote: Vote;
  setNewVote: Dispatch<Vote>;
}): JSX.Element => {
  const { pollFromDB, sortedTimes, newVote, setNewVote } = props;

  const getPublicCountLabel = (time: Time): string => {
    const count = pollFromDB.publicTimeCounts?.find(
      (currentCount) =>
        currentCount.start === time.start && currentCount.end === time.end
    );

    if (!count || count.total === 0) {
      return "0 votes";
    }

    if (count.ifNeedBe > 0) {
      return `${count.yes} yes, ${count.ifNeedBe} maybe`;
    }

    return `${count.yes} yes`;
  };

  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
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
          {pollFromDB.showResultsToParticipants !== false && (
            <tr>
              {sortedTimes.map((time: Time) => (
                <td key={JSON.stringify(time)} className="poll-public-count-cell">
                  <span className="poll-public-count">
                    <PersonFill className="poll-public-count-icon" />
                    {getPublicCountLabel(time)}
                  </span>
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
              />
            )}
          {pollFromDB.open && pollFromDB.type === "oneonone" && (
            <MarkTimesOneOnOne
              times={sortedTimes}
              newVote={newVote}
              poll={pollFromDB}
              setNewVote={setNewVote}
            />
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PollTableVoter;
