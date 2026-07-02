import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "cal-sans";
import "@fontsource/inter";
import "../src/styles/global.scss";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session?: Session }>): JSX.Element => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
