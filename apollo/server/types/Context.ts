import { ExpressContext } from 'apollo-server-express';
import { Session } from 'next-auth';

export interface Context extends ExpressContext {
  session: Session | null;
}
