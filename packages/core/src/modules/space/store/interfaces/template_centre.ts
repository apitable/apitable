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

import * as actions from '../../../shared/store/action_constants';

export interface ITemplateCentre {
  /**
   * template category
   */
  category: ITemplateCategory[];
  
  /**
   * some template's template directory
   */
  directory: ITemplateDirectory | null;
}

export interface ITemplateChoiceHeader {
  templateIds: string[];
  image: string;
  bannerDesc: {
    title: string;
    desc: string;
  };
}

export interface ITemplate {
  templateId: string;
  templateName: string;
  nodeId: string;
  nodeType: number;
  cover: string;
  description: string;
  tags: string[];
  avatar: string;
  nickName: string;
  uuid: string;
}

export interface ITemplateDirectory {
  avatar: string;
  categoryCode: string;
  categoryName: string;
  nickName: string;
  nodeTree: ITemplateTree;
  spaceName: string;
  templateId: string;
  templateName: string;
  uuid: string;
  isMemberNameModified?: boolean;
}

export interface ITemplateTree {
  nodeId: string;
  nodeName: string;
  icon: string;
  type: number;
  extra: string;
  children: ITemplateTree[];
}

export interface ITemplateCategory {
  categoryCode: string;
  categoryName: string;
}

export interface ISearchAblum {
  name: string;
  albumId: string;
}

export interface ISearchTemplate {
  categoryCode: string;
  categoryName: string;
  tags: string[];
  templateId: string;
  templateName: string;
}

export interface IUpdateTemplateCategoryAction {
  type: typeof actions.UPDATE_TEMPLATE_CATEGORY;
  payload: ITemplateCategory[];
}

export interface IUpdateTemplateDirectoryAction {
  type: typeof actions.UPDATE_TEMPLATE_DIRECTORY;
  payload: ITemplateDirectory | null;
}
