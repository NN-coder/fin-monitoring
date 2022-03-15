import { NoEnvVarError } from '../errors/NoEnvVarError';

const nodeEnv = process.env.NODE_ENV;
const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URI;

if (!graphqlUri) throw new NoEnvVarError('graphql uri');

export const browserEnv = {
  nodeEnv,
  graphqlUri,
} as const;
