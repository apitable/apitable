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

import { produce } from 'immer';
import { ITemplateCentre, IUpdateTemplateCategoryAction, IUpdateTemplateDirectoryAction } from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

const defaultTemplateCentre: ITemplateCentre = {
  category: [],
  directory: null,
};

type ISidebarActions = IUpdateTemplateCategoryAction | IUpdateTemplateDirectoryAction;

export const templateCentre = produce((draftSidebar: ITemplateCentre = defaultTemplateCentre, action: ISidebarActions) => {
  switch (action.type) {
    case actions.UPDATE_TEMPLATE_CATEGORY: {
      draftSidebar.category = action.payload;
      return draftSidebar;
    }
    case actions.UPDATE_TEMPLATE_DIRECTORY: {
      draftSidebar.directory = action.payload;
      return draftSidebar;
    }
    default:
      return draftSidebar;
  }
}, defaultTemplateCentre);
