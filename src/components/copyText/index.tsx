import { Form } from "react-bootstrap";
import { PollFromDB } from "../../models/poll";
import CopyTextMain from "./CopyTextMain";

const CopyText = (props: { poll: PollFromDB; baseUrl?: string }): JSX.Element => {
  const { poll, baseUrl } = props;

  return (
    <div className="poll-shareinvite-content">
      <Form
        onSubmit={(e): void => {
          e.preventDefault();
        }}
      >
        <CopyTextMain poll={poll} baseUrl={baseUrl} />
      </Form>
    </div>
  );
};
export default CopyText;
