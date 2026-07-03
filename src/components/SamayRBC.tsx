import { Calendar, Views, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import { Time } from "../models/poll";

const localizer = dayjsLocalizer(dayjs);

const SamayRBC = (props: {
  pollTimes;
  setTimes;
  step?: number;
}): JSX.Element => {
  const { pollTimes, setTimes, step = 60 } = props;

  const onTimesChange = ({ start, end }): void => {
    const newTime: Time = {
      start: start.getTime(),
      end: end.getTime(),
    };

    setTimes([...pollTimes, newTime]);
  };

  const onTimeRemove = ({ start, end }): void => {
    const newPollTimes = pollTimes.filter(
      (time) => !(time.start === start.getTime() && time.end === end.getTime())
    );

    setTimes([...newPollTimes]);
  };

  const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
    selectRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
  };

  return (
    <Calendar
      defaultView={Views.WEEK}
      events={pollTimes.map((time) => ({
        start: new Date(time.start),
        end: new Date(time.end),
      }))}
      localizer={localizer}
      onSelectSlot={onTimesChange}
      onSelectEvent={onTimeRemove}
      step={step || 60}
      timeslots={60 / (step || 60)}
      scrollToTime={new Date(1970, 0, 1, 8, 0, 0)}
      formats={formats}
      views={["week"]}
      selectable
    />
  );
};

export default SamayRBC;
