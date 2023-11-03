import {
  createConfiguration,
  AutomationApi,
  RequestContext, ResponseContext,
  ServerConfiguration
} from '@apitable/api-client';
import {getEnvVariables, getReleaseVersion, getSpaceIdFormTemplate} from "pc/utils/env";
import {apiErrorManager, redirectIfUserApplyLogout} from "api/utils";

const defaultMiddleware = [
    {
        pre: (context: RequestContext): Promise<RequestContext> => {
            redirectIfUserApplyLogout();
            // @ts-ignore
            const customHeaders = window.__initialization_data__.headers;
            if (customHeaders && Object.keys(customHeaders).length) {
                for (const k in customHeaders) {
                    context.setHeaderParam(k, customHeaders[k]);
                }
            }

            if (process.env.NODE_ENV === 'production') {
                context.setHeaderParam('X-Front-Version', getReleaseVersion());
                const spaceId = getSpaceIdFormTemplate();
                if (spaceId) {
                    context.setHeaderParam('X-Space-Id', spaceId);
                }
            }
            return new Promise((resolve) => resolve(context));
        },
        post: async (context: ResponseContext): Promise<ResponseContext>  => {
            const text = await context.body.text()
            let response;
            try {
                response= JSON.parse(text);
            }catch (e) {
                console.error(e)
            }
            const newContext = new ResponseContext(context.httpStatusCode, context.headers, {
                text: () => new Promise((resolve) => resolve(text)),
                binary: () => context.body.binary(),
            });
            if (!response) return new Promise((resolve) => resolve(newContext));
            const { success, code, data, message = 'Error' } = response;
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
]

export const automationApiClient = new AutomationApi(createConfiguration({
  baseServer: new ServerConfiguration(`${getEnvVariables()?.NEXT_PUBLIC_PUBLIC_URL ?? ''}/api/v1`, {}),
  promiseMiddleware: defaultMiddleware
}));
