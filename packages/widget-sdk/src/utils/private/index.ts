import { IPermissionResult } from 'interface';

export * from './widgetCliSocket';

export function errMsg(message: string): IPermissionResult {
  return { acceptable: false, message };
}