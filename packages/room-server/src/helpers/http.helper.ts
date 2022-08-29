import { IAuthHeader } from 'interfaces/axios.interfaces';

/**
 * 请求头设置
 * @param cookie 会话KEY
 * @param token Authorization Header
 */
export const createAuthHeaders = ({ cookie, token }: IAuthHeader): any => {
  if (cookie) {
    return {
      Cookie: cookie,
    };
  }

  if (token) {
    return {
      Authorization: token,
    };
  }
};

export const withSpaceIdHeader = (header: any, spaceId?: string) => {
  return spaceId ? { ...header, 'X-Space-Id': spaceId } : header;
};