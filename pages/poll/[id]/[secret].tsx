import React, { useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { Container, Jumbotron } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Layout from "../../../src/components/Layout";
import AdminPollInfo from "../../../src/components/poll/AdminPollInfo";
import PollTableAdmin from "../../../src/components/poll/PollTableAdmin";
import SubmitFinalTime from "../../../src/components/poll/SubmitFinalTime";
import { Time, TimeFromDB, PollFromDB } from "../../../src/models/poll";
import SamayPoll from "../../../src/models/poll";
import { decrypt } from "../../../src/utils/encryption";
import connectToDatabase from "../../../src/utils/db";

dayjs.extend(localizedFormat);

const Poll = (props: {
  pollFromDB: PollFromDB;
  pollID: string;
  secret: string;
}): JSX.Element => {
  const { pollFromDB, pollID, secret } = props;
  const sortedTimes: TimeFromDB[] = pollFromDB.times.sort(
    (a: TimeFromDB, b: TimeFromDB) => a.start - b.start
  );
  const [finalTime, setFinalTime] = useState<Time | undefined>();

  return (
    <>
      <Head>
        <title>Samay — finalise time</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <div className="global-page-section">
          <Container className="global-container">
            <Jumbotron className="poll-info-jumbo">
              <AdminPollInfo poll={pollFromDB} showFinalTime showCopyBox />
            </Jumbotron>
            {pollFromDB.votes?.length > 0 && (
              <>
                <Jumbotron className="poll-table-jumbo" id="all-votes-table">
                  <PollTableAdmin
                    pollFromDB={pollFromDB}
                    sortedTimes={sortedTimes}
                    setFinalTime={setFinalTime}
                  />
                </Jumbotron>
                {pollFromDB.open && (
                  <SubmitFinalTime
                    finalTime={finalTime}
                    pollID={pollID}
                    secret={secret}
                    poll={pollFromDB}
                  />
                )}
              </>
            )}
          </Container>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let pollID = null;
  let secret = null;
  if (context.params) {
    pollID = context.params.id;
    secret = context.params.secret;
  }
  await connectToDatabase();
  const pollFromDBRaw = await SamayPoll.findOne({ _id: pollID }).lean();

  if (!pollFromDBRaw) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const pollFromDB = JSON.parse(JSON.stringify(pollFromDBRaw));

  if (secret !== decrypt(pollFromDB.secret)) {
    return {
      redirect: {
        destination: `/poll/${pollID}`,
        permanent: false,
      },
    };
  }

  return {
    props: { pollFromDB, pollID, secret }, // will be passed to the page component as props
  };
};

export default Poll;
