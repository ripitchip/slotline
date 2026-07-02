import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Jumbotron } from "react-bootstrap";
import { signIn } from "next-auth/react";
import Layout from "../src/components/Layout";
import { getPageSession } from "../src/utils/auth";

const Login = (): JSX.Element => {
  const router = useRouter();
  const callbackUrl =
    typeof router.query.callbackUrl === "string"
      ? router.query.callbackUrl
      : "/";

  return (
    <>
      <Head>
        <title>Samay — sign in</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <div className="global-page-section">
          <Container className="global-container">
            <Jumbotron className="new-poll-jumbo">
              <h1>Sign in</h1>
              <p>You need an account to create polls and view results.</p>
              <Button
                className="global-primary-button"
                onClick={() => signIn("oidc", { callbackUrl })}
              >
                Sign in with OIDC
              </Button>
            </Jumbotron>
          </Container>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getPageSession(context);

  if (session) {
    const callbackUrl =
      typeof context.query.callbackUrl === "string"
        ? context.query.callbackUrl
        : "/";

    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;
