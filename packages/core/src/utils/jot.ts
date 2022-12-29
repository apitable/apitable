import { IAnyAction } from 'engine';

export enum ActionType {
  AddRow = 'addRow',
  AddColumn = 'addColumn',
  AddRecord = 'addRecord',
  AddField = 'addField',
  DelRow = 'delRow',
  DelColumn = 'delColumn',
  UpdateColumn = 'updateColumn',
  DelRecord = 'delRecord',
  DelField = 'delField',
  UpdateField = 'updateField',
  UpdateRecord = 'updateRecord',
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
    // Change the path to meta -> views -> vIdx -> name, change a view name
  } else if (metaField === 'views' && viewProperty === 'name') {
    return {
      type: ActionType.ModifyViewName,
      context: { viewIndex, viewProperty }
    };
  // Change the path to meta -> views -> vIdx -> xxx, change the view configuration, filtering, grouping, etc. of a view
  } else if (metaField === 'views' && viewProperty) {
    return {
      type: ActionType.SetViewProperty,
      context: { viewIndex, viewProperty }
    };
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