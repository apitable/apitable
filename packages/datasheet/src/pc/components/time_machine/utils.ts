import { IOperation, IJOTAction, IObjectDeleteAction, IObjectReplaceAction, IObjectInsertAction } from '@apitable/core';

export const getForeignDatasheetIdsByOp = (opList: IOperation[]) => {
  const actions = opList.reduce((acc, op) => {
    if (Array.isArray(op.actions)) {
      acc.push(...op.actions);
    }
    return acc;
  }, [] as IJOTAction[]);
  const ids = new Set<string>();
  actions.forEach((action) => {
    /**
     * oi 添加引用列，回滚时对应的需要od自己的引用列和关联表的引用列
     * od 删除引用列，回滚时需要oi自己的引用列和关联表的引用列
     * or 操作同上 od 或者 oi
    */
    const op = (action as IObjectDeleteAction | IObjectReplaceAction).od || (action as IObjectInsertAction).oi;
    if (op && op.property && op.property.foreignDatasheetId) {
      ids.add(op.property.foreignDatasheetId);
    }
  });
  return [...ids];
};
