import { PageConfig } from 'next';
import { apolloServer } from '../../apollo/server';
import { serverEnv } from '../../env/serverEnv';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

await apolloServer.start();
export default apolloServer.createHandler({ path: serverEnv.graphqlUri });
