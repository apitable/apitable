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

import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let lastTemplateId: string | undefined;

store.subscribe(function TemplateChange() {
  const previousTemplateId = lastTemplateId;
  const state = store.getState();
  const { templateId } = state.pageParams;
  lastTemplateId = templateId;
  if ((!lastTemplateId && !previousTemplateId) || previousTemplateId === lastTemplateId) {
    return;
  }

  console.log('init resourceService.instance!: ', templateId);

  resourceService.instance!.init();
});
