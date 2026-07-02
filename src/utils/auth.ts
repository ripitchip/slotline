import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth/next";
import { NextAuthOptions, Session } from "next-auth";

const authEnv = (name: string): string => process.env[name] || "";

const assertAuthConfigured = (): void => {
  ["NEXTAUTH_SECRET", "OIDC_ISSUER", "OIDC_CLIENT_ID"].forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`${name} is required for OIDC authentication`);
    }
  });
};

const authConfigured = (): boolean =>
  ["NEXTAUTH_SECRET", "OIDC_ISSUER", "OIDC_CLIENT_ID"].every((name) =>
    Boolean(process.env[name])
  );

const oidcIssuer = authEnv("OIDC_ISSUER");
const oidcClientSecret = authEnv("OIDC_CLIENT_SECRET");
const oidcClientAuthMethod = oidcClientSecret ? "client_secret_basic" : "none";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "oidc",
      name: process.env.OIDC_PROVIDER_NAME || "OIDC",
      type: "oauth",
      wellKnown: `${oidcIssuer}/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      checks: ["pkce", "state"],
      clientId: authEnv("OIDC_CLIENT_ID"),
      ...(oidcClientSecret ? { clientSecret: oidcClientSecret } : {}),
      client: {
        token_endpoint_auth_method: oidcClientAuthMethod,
      },
      profile(profile): {
        id: string;
        name: string | null;
        email: string | null;
      } {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username || null,
          email: profile.email || null,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.sub) {
        return {
          ...token,
          sub: profile.sub,
        };
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub || "",
          },
        };
      }

      return session;
    },
  },
};

export const getApiSession = (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> => {
  assertAuthConfigured();
  return getServerSession(req, res, authOptions);
};

export const getOptionalApiSession = (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> => {
  if (!authConfigured()) {
    return Promise.resolve(null);
  }

  return getServerSession(req, res, authOptions);
};

export const getPageSession = (
  context: GetServerSidePropsContext
): Promise<Session | null> => {
  assertAuthConfigured();
  return getServerSession(context.req, context.res, authOptions);
};
