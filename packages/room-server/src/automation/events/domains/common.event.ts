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

import { IEventInstance, IOPEvent } from '@apitable/core';
import { AutomationTriggerEntity } from '../../entities/automation.trigger.entity';

export type CommonEvent = Omit<IEventInstance<IOPEvent>, 'context'> & {
  context: CommonEventContext,
  beforeApply: boolean,
  metaContext: CommonEventMetaContext,
};

export type CommonEventMetaContext = {
  dstIdTriggersMap: { [datasheetId: string]: AutomationTriggerEntity[] },
  triggerSlugTypeIdMap: { [serviceSlug: string]: string},
  msgIds: string[]
};

export type CommonEventContext = {
  datasheetId: string,
  datasheetName: string,
  recordId: string,
  [key: string]: any,
};