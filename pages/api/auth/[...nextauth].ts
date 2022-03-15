import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { adapter } from '../../../prisma/adapter';
import { serverEnv } from '../../../env/serverEnv';

export default NextAuth({
  secret: serverEnv.nextAuthSecret,
  adapter,
  providers: [
    GoogleProvider({
      clientId: serverEnv.googleClientId,
      clientSecret: serverEnv.googleClientSecret,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      return { ...session, user: user as Session['user'] };
    },
  },
  debug: serverEnv.nodeEnv === 'development',
});
