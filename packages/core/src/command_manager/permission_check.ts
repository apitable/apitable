import { IJOTAction, IObjectDeleteAction, IObjectInsertAction, IObjectReplaceAction, IOperation, OTActionName } from 'engine';
import { FieldType, IField } from 'types';
import { IViewProperty } from 'store';

export class PermissionCheck {
  constructor() { }

  checkOperation(
    operation: IOperation,
    permission: any,
    resultSet: { [key: string]: any },
  ) {
    const cmd = operation.cmd;

    for (const action of operation.actions) {
      if (action.p[0] === 'meta') {
        this.dealWithMeta(cmd, action, permission, resultSet);
      } else {
        this.dealWithRecordMap(cmd, action, permission, resultSet);
      }
    }
  }

  /**
   * @description collects op operations related to adding fields (adding fields caused by pasting are also counted)
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByAddField(cmd: string, action: IObjectInsertAction, permission: any, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    if (oiData.type === FieldType.Link) {
      // Add a magical association type, you need to judge the permission of the association table
      const { foreignDatasheetId } = oiData.property;
      // This table establishes association (including self-association) operations to directly judge permissions
      if (resultSet.datasheetId === resultSet.mainDatasheetId) {
        if (!permission.fieldCreatable) {
          throw new Error('OPERATION_DENIED');
        }
      } else if (foreignDatasheetId !== resultSet.mainDatasheetId) {
        // The association table is not associated with this table, and the abnormal OP will be rejected directly
        throw new Error('OPERATION_ABNORMAL');
      } else {
        // The associated table is linked to the operation of adding an associated column, and the editable permission is checked.
        if (!permission.editable) {
          throw new Error('OPERATION_DENIED');
        }
      }
    } else {
      // Without creating an associated field column, you can directly judge permissions
      if (!permission.fieldCreatable) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description collects and modifies some op operations related to fields
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByChangeField(cmd: string, action: IObjectReplaceAction, permission: any, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    const odData = action.od as IField;
    // modify the field name
    if (oiData.name !== odData.name) {
      if (!permission.fieldRenamable) {
        throw new Error('OPERATION_DENIED');
      }
    }
    // modify field description
    if ('desc' in oiData && 'desc' in odData && oiData.desc !== odData.desc) {
      if (!permission.fieldPropertyEditable) {
        throw new Error('OPERATION_DENIED');
      }
    }
    // modify the field type
    if (oiData.type !== odData.type) {
      let skip = false;
      // Associative table operations
      if (resultSet.datasheetId !== resultSet.mainDatasheetId) {
        // Because the associated column is deleted from this table, 
        // the associated column of the associated table is converted to text without verification permission
        if (odData.type == FieldType.Link
          && odData.property.foreignDatasheetId === resultSet.mainDatasheetId && oiData.type == FieldType.Text) {
          skip = true;
        } else if (oiData.type == FieldType.Link
          && oiData.property.foreignDatasheetId === resultSet.mainDatasheetId && cmd.startsWith('UNDO:')) {
          // Because this table revokes and deletes the associated column, 
          // the original associated column of the associated table is transferred back to the unchecked permission of the associated field
          skip = true;
        }
      }
      // Non-associative table linkage operation, check field attribute editing permission (correspondingly manageable)
      if (!skip && !permission.fieldPropertyEditable) {
        throw new Error('OPERATION_DENIED');
      }
    } else {
      // If the type is the same, then modify the field properties to exclude special field operations
      const allowEditFieldTypes = [FieldType.Member, FieldType.CreatedBy, FieldType.LastModifiedBy];
      if (allowEditFieldTypes.includes(oiData.type)) {
        // Special fields need to be editable above
        if (!permission.editable) {
          throw new Error('OPERATION_DENIED');
        }
      } else {
        // Otherwise, check the field attribute editing permission (correspondingly manageable)
        if (!permission.fieldPropertyEditable) {
          throw new Error('OPERATION_DENIED');
        }
      }

    }
  }

  /**
   * @description some op operations related to modifying and deleting fields
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByDeleteField(action: IObjectDeleteAction, permission: any, resultSet: { [key: string]: any }) {
    const odData = action.od as IField;
    if (odData.type === FieldType.Link) {
      const { foreignDatasheetId } = odData.property;
      // This table disassociates (including self-association) operations, directly judging permissions
      if (resultSet.datasheetId === resultSet.mainDatasheetId) {
        if (!permission.fieldRemovable) {
          throw new Error('OPERATION_DENIED');
        }
      } else if (foreignDatasheetId !== resultSet.mainDatasheetId) {
        // The association table is not associated with this table, and the abnormal OP will be rejected directly
        throw new Error('OPERATION_ABNORMAL');
      } else {
        // The associated table is linked to delete the associated column, and the editable permission is checked.
        if (!permission.editable) {
          throw new Error('OPERATION_DENIED');
        }
      }
    } else {
      if (!permission.fieldRemovable) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  collectByView(action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    // Operations related to this table require editable roles or above
    if (resultSet.datasheetId === resultSet.mainDatasheetId) {
      const view = resultSet.temporaryViews[action.p[2]] as IViewProperty;
      if (action.p.length === 3) {
        // new view operation(includes duplicate view)
        if ('li' in action) {
          if (!permission.viewCreatable) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
        // delete view
        if ('ld' in action) {
          if (!permission.viewRemovable || view.lockInfo) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
        // move view
        if ('lm' in action) {
          if (!permission.viewMovable) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
      } else if (action.p.length > 3) {
        switch (action.p[3]) {
          case 'name':
            // view rename
            if (!permission.viewRenamable) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'filterInfo':
            // view filter
            if (!permission.viewFilterable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'groupInfo':
            // view grouping
            if (!permission.fieldGroupable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'sortInfo':
            // view sort
            if (!permission.columnSortable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'rowHeightLevel':
            // view row height
            if (!permission.rowHighEditable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'rows':
            // the affect of records add  towards to view attributes
            if ('li' in action) {
              if (!permission.rowCreatable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // the affect of records add towards to view attributes
            if ('ld' in action) {
              if (!permission.rowRemovable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // the affect of records move towards to view attributes
            if ('lm' in action) {
              if (!permission.rowSortable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            break;
          case 'columns':
            // ====== hidden column ======
            if ('li' in action && 'ld' in action && action.li.hidden != action.ld.hidden) {
              if (!permission.columnHideable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== Field order ======
            if ('lm' in action) {
              if (!permission.fieldSortable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== Field addition affects view properties ======
            if ('li' in action && !('ld' in action)) {
              if (!permission.fieldCreatable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== Effect of field deletion on view properties ======
            if (!('li' in action) && 'ld' in action) {
              if (!permission.fieldRemovable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            if (action.p.length < 6) {
              break;
            }
            // ====== Field width ======
            if (action.p[5] === 'width') {
              if (!permission.columnWidthEditable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== Field Statistics ======
            if (action.p[5] === 'statType') {
              if (!permission.columnCountEditable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            break;
          case 'style':
            if (action.p.length < 5) {
              break;
            }
            if (view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            // ====== View layout ======
            if (action.p[4] === 'layoutType' || action.p[4] === 'isAutoLayout' || action.p[4] === 'cardCount') {
              if (!permission.viewLayoutEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== View style ======
            if (action.p[4] === 'isCoverFit' || action.p[4] === 'coverFieldId' || action.p[4] === 'isColNameVisible') {
              if (!permission.viewStyleEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== View key fields (Kanban grouping fields, Gantt chart start and end time fields) ======
            if (action.p[4] === 'kanbanFieldId' || action.p[4] === 'startFieldId' || action.p[4] === 'endFieldId') {
              if (!permission.viewKeyFieldEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== View Color Options ======
            if (action.p[4] === 'colorOption') {
              if (!permission.viewColorOptionEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            break;
          case 'lock':
            // ====== View lock operation ======
            if (!permission.manageable) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          default:
            break;
        }
      }
      // other unresolved operations
      if (!permission.editable) {
        throw new Error('OPERATION_DENIED');
      }
    } else {
      // Associative table operation, directly release with editable permission
      if (permission.editable) {
        return;
      }
      // If not, it is possible that the columns in the view are changed 
      // because the table bidirectionally deletes the associated column (or undoes the operation)
      if (action.p[3] !== 'columns') {
        throw new Error('OPERATION_DENIED');
      }
      // Do records in the outer layer to check whether there is a corresponding delete/undelete column
      if (
        !('li' in action || 'ld' in action)
      ) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description handles data related to Meta in Operation
   * @param action
   * @param permission
   * @param resultSet
   */
  dealWithMeta(cmd: string, action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    if (action.p[1] === 'fieldMap') {
      // ===== Field operation BEGIN =====
      /**
        * Field operation, to determine whether the management authority is above
        * Member fields are special. Editing data requires modifying the attributes of the column data source, 
        * so don’t intercept it in advance, and judge according to the specific type.
        * Anyway, create, modify, delete operations have been fine-grained
        * The following start field fine-grained permission judgment
        */
      // ====== Add field operations (copy fields also belong) ======
      if (('oi' in action) && !('od' in action)) {
        // Only and only oi, representing a new field (or copy field)
        this.collectByAddField(cmd, action, permission, resultSet);
        return;
      }
      // ====== Modify field operation ======
      if (('oi' in action) && ('od' in action)) {
        this.collectByChangeField(cmd, action, permission, resultSet);
        return;
      }
      // ====== delete field operation ======
      if (!('oi' in action) && ('od' in action)) {
        this.collectByDeleteField(action, permission, resultSet);
        return;
      }
      // ===== Field operation END =====
    } else if (action.p[1] === 'views') {
      // ===== View operations =====
      this.collectByView(action, permission, resultSet);
    } else if (action.p[1] === 'widgetPanels') {
      // ===== Components panel operation =====
      // The addition and deletion of component panels and components require manageable roles
      if (!permission.manageable) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description collects ops related to operation lines
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByOperateForRow(cmd: string, action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    if (!permission.editable) {
      throw new Error('OPERATION_DENIED');
    }
  }

  /**
   * @description collects ops related to comments
   * @param {*} action
   * @param {*} permission
   * @param resultSet
   */
  collectByOperateForComment(action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    if (!permission.readable) {
      throw new Error('OPERATION_DENIED');
    }
  }

  /**
   * @description handles data related to RecordMap
   * @param {IJOTAction} action
   * @param {*} permission
   * @param resultSet
   */
  dealWithRecordMap(cmd: string, action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    // ===== Record operation BEGIN =====
    if (!(action.p.includes('commentCount') || action.p.includes('comments')) && action.p[0] === 'recordMap') {
      // row data manipulation
      this.collectByOperateForRow(cmd, action, permission, resultSet);
    }
    // ===== Record operation END =====

    // ===== Collect comments operation BEGIN ====
    if (action.n !== OTActionName.ObjectInsert && action.p.includes('comments') && action.p[0] === 'recordMap') {
      this.collectByOperateForComment(action, permission, resultSet);
    }
    // ===== Collect comments operation END ====
  }
}

export const permissionCheck = new PermissionCheck();
