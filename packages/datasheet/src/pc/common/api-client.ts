import axios from 'axios';
import {
  createConfiguration,
  AutomationApi,
  RequestContext, ResponseContext,
  ServerConfiguration, WorkbenchNodeApiApi
} from '@apitable/api-client';
import { isServer } from '@apitable/core/dist/utils/env';
import { apiErrorManager, redirectIfUserApplyLogout } from 'api/utils';
import { getCookie } from 'pc/utils';
import { getReleaseVersion, getSpaceIdFormTemplate } from 'pc/utils/env';

const CONST_XSRF_TOKEN = 'XSRF-TOKEN';
const defaultMiddleware = [
  {
    pre: async (context: RequestContext): Promise<RequestContext> => {
      redirectIfUserApplyLogout();
      if(!isServer()) {
        // @ts-ignore
        const customHeaders = window.__initialization_data__.headers;
        if (customHeaders && Object.keys(customHeaders).length) {
          for (const k in customHeaders) {
            context.setHeaderParam(k, customHeaders[k]);
          }
        }

        const xsrfToken = getCookie(CONST_XSRF_TOKEN);
        context.setHeaderParam('X-XSRF-TOKEN', xsrfToken);

        const spaceId = getSpaceIdFormTemplate();

        context.setHeaderParam('X-Space-Id', spaceId ?? axios.defaults.headers.common['X-Space-Id']);
      }

      if (process.env.NODE_ENV === 'production') {
        context.setHeaderParam('X-Front-Version', getReleaseVersion());
      }

      const requestContextPromise : Promise<RequestContext>= new Promise((resolve) => resolve(context));
      return await requestContextPromise;
    },
    post: async (context: ResponseContext): Promise<ResponseContext> => {
      const text = await context.body.text();
      let response;
      try {
        response= JSON.parse(text);
      }catch (e) {
        console.error(e);
      }
      const newContext = new ResponseContext(context.httpStatusCode, context.headers, {
        text: () => new Promise((resolve) => resolve(text)),
        binary: () => context.body.binary(),
      });
      if (!response) return new Promise((resolve) => resolve(newContext));
      const { success, code, message = 'Error' } = response;
      if(!success) {
        try {
          apiErrorManager.handleError(code);
        } catch (e) {
          throw new Error(message);
        }
      }
      return new Promise((resolve) => resolve(newContext));
    }
  }
];

const endpoint =isServer() ? process?.env?.API_PROXY : '';
export const automationApiClient = new AutomationApi(createConfiguration({
  baseServer: new ServerConfiguration(`${endpoint}/api/v1`, {}),
  promiseMiddleware: defaultMiddleware
}));

export const workbenchClient = new WorkbenchNodeApiApi(createConfiguration({
  baseServer: new ServerConfiguration(`${endpoint}/api/v1`, {}),
  promiseMiddleware: defaultMiddleware
}));
