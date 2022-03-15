import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { getSession } from 'next-auth/react';
import { Context } from './types/Context';

export const context: ContextFunction<ExpressContext, Context> = async ({ req, res }) => {
  const session = await getSession({ req });
  return { req, res, session };
};
