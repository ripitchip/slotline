import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, Card, Container } from "react-bootstrap";
import { Grid } from "react-bootstrap-icons";
import Layout from "../src/components/Layout";
import DeletePoll from "../src/components/poll/DeletePoll";
import { decrypt } from "../src/helpers";
import SamayPoll, { PollFromDB } from "../src/models/poll";
import { getPageSession } from "../src/utils/auth";
import connectToDatabase from "../src/utils/db";
import { getSessionUserId, serializeOwnedPoll } from "../src/utils/pollAccess";

type OwnedPoll = Partial<PollFromDB> & {
  _id: string;
  adminPath: string;
};

const getSecretFromAdminPath = (adminPath: string): string => {
  return adminPath.split("/").pop() || "";
};

const RecentPolls = (props: { polls: OwnedPoll[] }): JSX.Element => {
  const { polls } = props;

  const pageSection = polls.length ? (
    <div className="global-page-section">
      <Container className="poll-container">
        <span className="your-polls-polls-heading">My polls</span>
        {polls.map((poll) => (
          <Link key={poll._id} href={poll.adminPath} passHref>
            <a>
              <Card className="your-polls-poll-card">
                <Card.Body>
                  <Card.Title>
                    {poll.title || "Untitled"}
                    <div className="card-options">
                      <DeletePoll
                        pollID={poll._id}
                        pollTitle={poll.title || ""}
                        secret={getSecretFromAdminPath(poll.adminPath)}
                      />
                    </div>
                  </Card.Title>
                </Card.Body>
              </Card>
            </a>
          </Link>
        ))}
      </Container>
    </div>
  ) : (
    <div className="global-page-section">
      <Container className="no-poll-container">
        <Grid className="icon" />
        <span className="first-line">No polls yet</span>
        <span className="second-line">
          Polls you create while signed in will appear here
        </span>
        <Link href="/" passHref>
          <Button className="global-small-primary-btn">Create a poll</Button>
        </Link>
      </Container>
    </div>
  );

  return (
    <>
      <Head>
        <title>Samay — my polls</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>{pageSection}</Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getPageSession(context);
  const ownerId = getSessionUserId(session);

  if (!ownerId) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/recent-polls",
        permanent: false,
      },
    };
  }

  await connectToDatabase();
  const polls = await SamayPoll.find({ ownerId })
    .sort({ createdAt: -1 })
    .lean();
  const serializedPolls: PollFromDB[] = JSON.parse(JSON.stringify(polls));

  return {
    props: {
      session,
      polls: serializedPolls.map((poll) => serializeOwnedPoll(poll, decrypt)),
    },
  };
};

export default RecentPolls;
