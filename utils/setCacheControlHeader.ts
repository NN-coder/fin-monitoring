import { ServerResponse } from 'http';

export const setCacheControlHeader = (res: ServerResponse) => {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
};
