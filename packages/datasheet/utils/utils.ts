import { NextPageContext } from 'next';

export const getRequestHeaders = (context: NextPageContext) => {
  const headers: Record<string, string> = {};
  const language = context.req?.headers['accept-language'];
  const cookie = context.req?.headers.cookie;

  if (language) {
    headers['Accept-Language'] = language;
  }

  if (cookie) {
    headers.cookie = cookie;
  }

  return headers;
};
