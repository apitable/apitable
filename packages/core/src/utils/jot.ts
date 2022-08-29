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

  // 更改的path为 meta -> views -> vIdx -> rows，改变一个视图的记录
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
    // 更改的path为 meta -> views -> vIdx -> columns，改变一个视图的列
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
    // 更改的path为 meta -> views -> vIdx -> name，改变一个视图名称
  } else if (metaField === 'views' && viewProperty === 'name') {
    return {
      type: ActionType.ModifyViewName,
      context: { viewIndex, viewProperty }
    };
  // 更改的path为 meta -> views -> vIdx -> xxx，改变一个视图的视图配置，过滤、分组等
  } else if (metaField === 'views' && viewProperty) {
    return {
      type: ActionType.SetViewProperty,
      context: { viewIndex, viewProperty }
    };
  // 更改的path为 meta -> fieldMap -> fieldId，改变字段数据
  } else if (fieldId) {
    // 新增字段
    if (hasOi && !hasOD) {
      return {
        type: ActionType.AddField,
        context: { fieldId }
      };
      // 删除字段
    } else if (hasOD && !hasOi) {
      return {
        type: ActionType.DelField,
        context: { fieldId }
      };
      // 更新字段
    } else if (hasOi && hasOD) {
      return {
        type: ActionType.UpdateField,
        context: { fieldId }
      };
    }
  } else if (recordId) {
    // 新增记录
    if (hasOi && !hasOD && !recordPropertyData) {
      return {
        type: ActionType.AddRecord,
        context: { recordId }
      };
      // 删除记录
    } else if (hasOD && !hasOi && !recordPropertyData) {
      return {
        type: ActionType.DelRecord,
        context: { recordId }
      };
      // 插入评论
    } else if (recordProperty === 'comments' && hasLi && !recordPropertyData) {
      return {
        type: ActionType.InsertComment,
        context: { recordId, data: action.li }
      };
      // 更新评论（点赞）
    } else if (recordProperty === 'comments' && hasLi && recordPropertyData) {
      return {
        type: ActionType.UpdateComment,
        context: { recordId, data: action.li }
      };
      // 删除评论
    } else if (recordProperty === 'comments' && hasLd) {
      return {
        type: ActionType.DelComment,
        context: { recordId, data: action.li }
      };
      // 增加评论数
    } else if (recordProperty === 'commentCount' && hasNa && action.na > 0) {
      return {
        type: ActionType.AddCommentCount,
        context: { recordId }
      };
      // 减少评论数
    } else if (recordProperty === 'commentCount' && hasNa && action.na < 0) {
      return {
        type: ActionType.DescCommentCount,
        context: { recordId }
      };
      // 更新记录
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