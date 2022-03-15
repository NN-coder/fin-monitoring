import { Adapter } from 'next-auth/adapters';
import { prisma } from '.';

export const adapter: Adapter = {
  async createUser(data) {
    return await prisma.user.create({ data });
  },
  async getUser(id) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (_) {
      return null;
    }
  },
  async getUserByEmail(email) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (_) {
      return null;
    }
  },
  async getUserByAccount({ provider, providerAccountId }) {
    try {
      return (
        await prisma.account.findUnique({
          where: { provider_providerAccountId: { provider, providerAccountId } },
          select: { user: true },
        })
      ).user;
    } catch (_) {
      return null;
    }
  },
  async linkAccount(data) {
    return (await prisma.account.create({ data })) as any;
  },
  async createSession(data) {
    return await prisma.session.create({ data });
  },
  async getSessionAndUser(sessionToken) {
    try {
      const sessionAndUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      const { user, ...session } = sessionAndUser;
      return { session, user };
    } catch (_) {
      return null;
    }
  },
  async updateSession({ sessionToken, ...data }) {
    return await prisma.session.update({ where: { sessionToken }, data });
  },
  async deleteSession(sessionToken) {
    return await prisma.session.delete({ where: { sessionToken } });
  },
  async updateUser({ id, ...data }) {
    return await prisma.user.update({ where: { id }, data });
  },
  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  },
  async unlinkAccount({ provider, providerAccountId }) {
    return (await prisma.account.delete({
      where: { provider_providerAccountId: { provider, providerAccountId } },
    })) as any;
  },
};
