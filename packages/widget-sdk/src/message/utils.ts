import { ExecuteResult, ICollaCommandExecuteResult, ICollaCommandOptions, ResourceType } from 'core';
import { isSandbox } from 'utils/private';
import { eventMessage } from './event_message';
import { IResponse, messageMap } from './protocol';
import { widgetMessage } from './widget_message';

/**
 * Is it a secure domain name.
 * 1. Main application with the same domain name.
 * 2. localhost Local debugging domain name.
 */
export const isSafeOrigin = (origin: string) => {
  const SAFE_ORIGIN_END = [window.location.origin];
  const LOCAL = ['https://localhost', 'http://localhost'];
  return SAFE_ORIGIN_END.some(str => origin.endsWith(str)) || LOCAL.some(str => origin.startsWith(str));
};

export const cmdExecute = (cmdOptions: ICollaCommandOptions, widgetId?: string): Promise<ICollaCommandExecuteResult<any>> => {
  if (isSandbox()) {
    return widgetMessage.syncCmd(cmdOptions);
  }
  if (!widgetId) {
    return new Promise((resolve) => resolve({
      result: ExecuteResult.None,
      resourceId: '',
      resourceType: ResourceType.Widget
    }));
  }
  return eventMessage.syncCmd(cmdOptions, widgetId!);
};

/**
 * Receiving Message Interceptor.
 * @param res 
 * @param callback 
 */
export const interceptor = (callback?: (data: any, messageId?: string) => void) => {
  return (res: IResponse<any>, messageId?: string) => {
    if (!res.success) {
      console.error(res.message);
      return;
    }
    callback?.(res.data, messageId);
    messageId && messageMap.pop(messageId, { 
      success: true,
      data: res.data
    });
  };
};