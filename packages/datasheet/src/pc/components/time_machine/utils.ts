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
     * oi Add reference columns, rollback corresponding to the need to od their own reference columns and reference columns of the associated table
     * od Delete reference columns, rollback requires oi own reference columns and reference columns of related tables
     * or operation as above od or oi
    */
    const op = (action as IObjectDeleteAction | IObjectReplaceAction).od || (action as IObjectInsertAction).oi;
    if (op && op.property && op.property.foreignDatasheetId) {
      ids.add(op.property.foreignDatasheetId);
    }
  });
  return [...ids];
};
