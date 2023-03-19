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

import { IAnyAction } from 'engine';
import { isString } from 'lodash';

export enum ActionType {
  AddRow = 'addRow',
  AddColumn = 'addColumn',
  AddRecord = 'addRecord',
  AddField = 'addField',
  DelRow = 'delRow',
  MoveRow = 'moveRow',
  DelColumn = 'delColumn',
  UpdateColumn = 'updateColumn',
  DelRecord = 'delRecord',
  DelField = 'delField',
  UpdateField = 'updateField',
  UpdateRecord = 'updateRecord',
  AddView = 'addView',
  DelView = 'delView',
  SetViewProperty = 'setViewProperty',
  ModifyViewName = 'modifyViewName',
  InsertComment = 'insertComment',
  UpdateComment = 'updateComment',
  AddCommentCount = 'addCommentCount',
  DelComment = 'delComment',
  DescCommentCount = 'descCommentCount',
  Unknown = 'unknown'
}

type TContext = { viewIndex?: number, viewProperty?: string, propertyIndex?: number, recordId?: string, fieldId?: string, data?: any };

export interface IParseActionRes {
  type: ActionType,
  context: TContext;
}

export const parseAction = (action: IAnyAction): IParseActionRes => {
  const hasOi = 'oi' in action;
  const hasOD = 'od' in action;
  const hasLi = 'li' in action;
  const hasLd = 'ld' in action;
  const hasNa = 'na' in action;
  const hasLm = 'lm' in action;

  const path = action.p;
  const modifyType = action.p[0];
  let viewIndex, metaField, viewProperty, propertyIndex, fieldId, recordId, recordPropertyData, recordProperty;
  if (modifyType === 'meta') {
    metaField = path[1];
    if (metaField === 'views') {
      viewIndex = path[2];
      viewProperty = path[3];
      propertyIndex = path[4];
    } else if (metaField === 'fieldMap') {
      fieldId = path[2];
    }
  } else if (modifyType === 'recordMap') {
    recordId = path[1];
    recordProperty = path[2];
    recordPropertyData = path[3];
  }

  // The changed path is meta -> views -> vIdx -> rows, changing the record of a view
  if (viewProperty === 'rows') {
    if (hasLi && !hasLd) {
      return {
        type: ActionType.AddRow,
        context: { viewIndex, viewProperty, propertyIndex }
      };
    } else if (hasLd) {
      return {
        type: ActionType.DelRow,
        context: { viewIndex, viewProperty, propertyIndex }
      };
    } else if (hasLm) {
      return {
        type: ActionType.MoveRow,
        context: {
          viewIndex,
          viewProperty,
          propertyIndex,
        }
      };
    }
    // The changed path is meta -> views -> vIdx -> columns, changing the columns of a view
  } else if (viewProperty === 'columns') {
    if (hasLi && hasLd) {
      return {
        type: ActionType.UpdateColumn,
        context: { viewIndex, viewProperty, propertyIndex }
      };
    } if (hasLi && !hasLd) {
      return {
        type: ActionType.AddColumn,
        context: { viewIndex, viewProperty, propertyIndex }
      };
    } else if (hasLd) {
      return {
        type: ActionType.DelColumn,
        context: { viewIndex, viewProperty, propertyIndex, fieldId: action.ld.fieldId }
      };
    }
  // Change the path to meta -> views -> vIdx -> xxx, change the view
  } else if (metaField === 'views') {
    // add view
    if (viewProperty == null && hasLi && !hasLd) {
      return {
        type: ActionType.AddView,
        context: { viewIndex }
      };
    }

    // delete view
    if (viewProperty == null && !hasLi && hasLd) {
      return {
        type: ActionType.DelView,
        context: { viewIndex }
      };
    }
    if (viewProperty === 'name' && hasOD && hasOi) {
      return {
        type: ActionType.ModifyViewName,
        context: { viewIndex, viewProperty }
      };
    }

    if (isString(viewProperty)) {
      return {
        type: ActionType.SetViewProperty,
        context: {
          viewIndex,
          viewProperty
        }
      };
    }
  // The changed path is meta -> fieldMap -> fieldId, changing the field data
  } else if (fieldId) {
    // add field
    if (hasOi && !hasOD) {
      return {
        type: ActionType.AddField,
        context: { fieldId }
      };
      // delete field
    } else if (hasOD && !hasOi) {
      return {
        type: ActionType.DelField,
        context: { fieldId }
      };
      // update field
    } else if (hasOi && hasOD) {
      return {
        type: ActionType.UpdateField,
        context: { fieldId }
      };
    }
  } else if (recordId) {
    // new record
    if (hasOi && !hasOD && !recordPropertyData) {
      return {
        type: ActionType.AddRecord,
        context: { recordId }
      };
      // delete record
    } else if (hasOD && !hasOi && !recordPropertyData) {
      return {
        type: ActionType.DelRecord,
        context: { recordId }
      };
      // insert comment
    } else if (recordProperty === 'comments' && hasLi && !recordPropertyData) {
      return {
        type: ActionType.InsertComment,
        context: { recordId, data: action.li }
      };
      // update comment(or like)
    } else if (recordProperty === 'comments' && hasLi && recordPropertyData) {
      return {
        type: ActionType.UpdateComment,
        context: { recordId, data: action.li }
      };
      // delete comment
    } else if (recordProperty === 'comments' && hasLd) {
      return {
        type: ActionType.DelComment,
        context: { recordId, data: action.li }
      };
      // add comment number
    } else if (recordProperty === 'commentCount' && hasNa && action.na > 0) {
      return {
        type: ActionType.AddCommentCount,
        context: { recordId }
      };
      // reduce comments
    } else if (recordProperty === 'commentCount' && hasNa && action.na < 0) {
      return {
        type: ActionType.DescCommentCount,
        context: { recordId }
      };
      // update records
    } else if (recordProperty === 'data' && recordPropertyData) {
      return {
        type: ActionType.UpdateRecord,
        context: { recordId, fieldId: recordPropertyData }
      };
    }
  }
  return {
    type: ActionType.Unknown,
    context: {}
  };
};

export const effectResourceAction = (type: ActionType): boolean => {
  return [
    ActionType.AddField,
    ActionType.AddRecord,
    ActionType.DelField,
    ActionType.DelRecord,
    ActionType.UpdateRecord,
    ActionType.UpdateField
  ].includes(type);
}; 