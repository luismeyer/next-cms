import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/google";

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing env var: GITHUB_CLIENT_SECRET");
}

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error("Missing env var: GITHUB_CLIENT_ID");
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return Boolean(
          profile?.email_verified && profile.email?.endsWith("@gmail.com")
        );
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
