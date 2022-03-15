import { GetStaticPaths, GetStaticPathsContext, GetStaticPathsResult } from 'next';

export type InferGetStaticPathsType<T> = T extends GetStaticPaths<infer P>
  ? P
  : T extends (
      context: GetStaticPathsContext
    ) => Promise<GetStaticPathsResult<infer P> | GetStaticPathsResult<infer P>>
  ? P
  : never;
