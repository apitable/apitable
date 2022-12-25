/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ICollaCommandExecuteResult, ICollaCommandOptions } from 'core';
import { widgetMessage } from 'iframe_message';
import { IResourceService } from 'resource';

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

declare const window: any;

export function getLanguage() {
  const language = typeof window == 'object' &&
    window.__initialization_data__ &&
    window.__initialization_data__.lang;
  return language || 'zh-CN';
}

export function isIframe() {
  const isIframe = typeof window == 'object' && window.__initialization_data__ && window.__initialization_data__.isIframe;
  return isIframe;
}

export const cmdExecute = async(
  cmdOptions: ICollaCommandOptions, resourceService: IResourceService
): Promise<ICollaCommandExecuteResult<any>> => {
  if (isIframe()) {
    return (await widgetMessage.syncCmd(cmdOptions));
  }
  return resourceService.commandManager.execute(cmdOptions);
};
