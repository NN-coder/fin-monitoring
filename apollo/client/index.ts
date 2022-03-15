import {
  ApolloClient,
  ApolloClientOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { browserEnv } from '../../env/browserEnv';

const httpLink = new HttpLink({ uri: browserEnv.graphqlUri, credentials: 'same-origin' });

const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
  link: httpLink,
  cache: new InMemoryCache(),
};

declare const global: typeof globalThis & { apolloClient: ApolloClient<NormalizedCacheObject> };
let apolloClient: typeof global.apolloClient;

if (browserEnv.nodeEnv === 'production') {
  apolloClient = new ApolloClient(apolloOptions);
} else {
  if (!global.apolloClient) global.apolloClient = new ApolloClient(apolloOptions);
  apolloClient = global.apolloClient;
}

export { apolloClient };
