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
   * @description 收集和添加字段（粘贴导致的添加字段也算）相关的 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByAddField(cmd: string, action: IObjectInsertAction, permission: any, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    if (oiData.type === FieldType.Link) {
      // 新增神奇关联类型，需要判断关联表的权限
      const { foreignDatasheetId } = oiData.property;
      // 本表建立关联（包含自关联）操作，直接判断权限
      if (resultSet.datasheetId === resultSet.mainDatasheetId) {
        if (!permission.fieldCreatable) {
          throw new Error('OPERATION_DENIED');
        }
      } else if (foreignDatasheetId !== resultSet.mainDatasheetId) {
        // 关联表关联的不是本表，不正常的 OP，直接拒绝
        throw new Error('OPERATION_ABNORMAL');
      } else {
        // 关联表联动新增关联列的操作，校验可编辑权限
        if (!permission.editable) {
          throw new Error('OPERATION_DENIED');
        }
      }
    } else {
      // 非创建关联字段列，可以直接判断权限
      if (!permission.fieldCreatable) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description 收集和修改字段相关的一些 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByChangeField(cmd: string, action: IObjectReplaceAction, permission: any, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    const odData = action.od as IField;
    // 修改字段名称
    if (oiData.name !== odData.name) {
      if (!permission.fieldRenamable) {
        throw new Error('OPERATION_DENIED');
      }
    }
    // 修改字段描述
    if ('desc' in oiData && 'desc' in odData && oiData.desc !== odData.desc) {
      if (!permission.fieldPropertyEditable) {
        throw new Error('OPERATION_DENIED');
      }
    }
    // 修改字段类型
    if (oiData.type !== odData.type) {
      let skip = false;
      // 关联表操作
      if (resultSet.datasheetId !== resultSet.mainDatasheetId) {
        // 因为本表删除了关联列，关联表的关联列转为文本的不校验权限
        if (odData.type == FieldType.Link
          && odData.property.foreignDatasheetId === resultSet.mainDatasheetId && oiData.type == FieldType.Text) {
          skip = true;
        } else if (oiData.type == FieldType.Link
          && oiData.property.foreignDatasheetId === resultSet.mainDatasheetId && cmd.startsWith('UNDO:')) {
          // 因为本表撤销删除关联列，关联表原关联列转回关联字段的不校验权限
          skip = true;
        }
      }
      // 非关联表联动操作，校验字段属性编辑权限（对应可管理）
      if (!skip && !permission.fieldPropertyEditable) {
        throw new Error('OPERATION_DENIED');
      }
    } else {
      // 类型一样，那么就是修改字段属性，排除特殊字段操作
      const allowEditFieldTypes = [FieldType.Member, FieldType.CreatedBy, FieldType.LastModifiedBy];
      if (allowEditFieldTypes.includes(oiData.type)) {
        // 特殊字段需要可编辑以上即可
        if (!permission.editable) {
          throw new Error('OPERATION_DENIED');
        }
      } else {
        // 否则校验字段属性编辑权限（对应可管理）
        if (!permission.fieldPropertyEditable) {
          throw new Error('OPERATION_DENIED');
        }
      }

    }
  }

  /**
   * @description 修改和删除字段相关的一些 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByDeleteField(action: IObjectDeleteAction, permission: any, resultSet: { [key: string]: any }) {
    const odData = action.od as IField;
    if (odData.type === FieldType.Link) {
      const { foreignDatasheetId } = odData.property;
      // 本表解除关联（包含自关联）操作，直接判断权限
      if (resultSet.datasheetId === resultSet.mainDatasheetId) {
        if (!permission.fieldRemovable) {
          throw new Error('OPERATION_DENIED');
        }
      } else if (foreignDatasheetId !== resultSet.mainDatasheetId) {
        // 关联表关联的不是本表，不正常的 OP，直接拒绝
        throw new Error('OPERATION_ABNORMAL');
      } else {
        // 关联表联动删除关联列的操作，校验可编辑权限
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
    // 本表相关操作需要可编辑角色以上
    if (resultSet.datasheetId === resultSet.mainDatasheetId) {
      const view = resultSet.temporaryViews[action.p[2]] as IViewProperty;
      if (action.p.length === 3) {
        // ====== 新增视图操作(包含复制视图) ======
        if ('li' in action) {
          if (!permission.viewCreatable) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
        // ====== 删除视图操作 ======
        if ('ld' in action) {
          if (!permission.viewRemovable || view.lockInfo) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
        // ====== 移动视图操作 ======
        if ('lm' in action) {
          if (!permission.viewMovable) {
            throw new Error('OPERATION_DENIED');
          }
          return;
        }
      } else if (action.p.length > 3) {
        switch (action.p[3]) {
          case 'name':
            // ====== 视图重命名操作 ======
            if (!permission.viewRenamable) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'filterInfo':
            // ====== 视图筛选 ======
            if (!permission.viewFilterable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'groupInfo':
            // ====== 视图分组 ======
            if (!permission.fieldGroupable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'sortInfo':
            // ====== 视图排序 ======
            if (!permission.columnSortable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'rowHeightLevel':
            // ====== 视图行高 ======
            if (!permission.rowHighEditable || view.lockInfo) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          case 'rows':
            // ====== 记录新增对视图属性的影响 ======
            if ('li' in action) {
              if (!permission.rowCreatable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 记录删除对视图属性的影响 ======
            if ('ld' in action) {
              if (!permission.rowRemovable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 记录移动顺序对视图属性的影响 ======
            if ('lm' in action) {
              if (!permission.rowSortable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            break;
          case 'columns':
            // ====== 隐藏列 ======
            if ('li' in action && 'ld' in action && action.li.hidden != action.ld.hidden) {
              if (!permission.columnHideable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 字段顺序 ======
            if ('lm' in action) {
              if (!permission.fieldSortable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 字段新增对视图属性的影响 ======
            if ('li' in action && !('ld' in action)) {
              if (!permission.fieldCreatable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 字段删除对视图属性的影响 ======
            if (!('li' in action) && 'ld' in action) {
              if (!permission.fieldRemovable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            if (action.p.length < 6) {
              break;
            }
            // ====== 字段宽度 ======
            if (action.p[5] === 'width') {
              if (!permission.columnWidthEditable || view.lockInfo) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 字段统计栏 ======
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
            // ====== 视图布局 ======
            if (action.p[4] === 'layoutType' || action.p[4] === 'isAutoLayout' || action.p[4] === 'cardCount') {
              if (!permission.viewLayoutEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 视图样式 ======
            if (action.p[4] === 'isCoverFit' || action.p[4] === 'coverFieldId' || action.p[4] === 'isColNameVisible') {
              if (!permission.viewStyleEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 视图关键字段（看板分组字段、甘特图开始结束时间字段） ======
            if (action.p[4] === 'kanbanFieldId' || action.p[4] === 'startFieldId' || action.p[4] === 'endFieldId') {
              if (!permission.viewKeyFieldEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            // ====== 视图颜色选项 ======
            if (action.p[4] === 'colorOption') {
              if (!permission.viewColorOptionEditable) {
                throw new Error('OPERATION_DENIED');
              }
              return;
            }
            break;
          case 'lock':
            // ====== 视图锁操作 ======
            if (!permission.manageable) {
              throw new Error('OPERATION_DENIED');
            }
            return;
          default:
            break;
        }
      }
      // 其他未解析到的操作
      if (!permission.editable) {
        throw new Error('OPERATION_DENIED');
      }
    } else {
      // 关联表操作，有可编辑权限直接放行
      if (permission.editable) {
        return;
      }
      // 若无可能是因为本表双向删除关联列（或者撤销该操作）造成视图中的 columns 变化
      if (action.p[3] !== 'columns') {
        throw new Error('OPERATION_DENIED');
      }
      // 做记录在外层校验是否有对应删除/恢复删除列
      if (
        !('li' in action || 'ld' in action)
      ) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description 处理 Operation 中和 Meta 相关的数据
   * @param action
   * @param permission
   * @param resultSet
   */
  dealWithMeta(cmd: string, action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    if (action.p[1] === 'fieldMap') {
      // ===== Field操作 BEGIN =====
      /**
       * 字段操作,判断是否管理权限以上
       * 成员字段比较特殊，编辑数据需要修改列数据源的属性，所以这里还是不要预先拦截，根据具体类型判断
       * 反正创建、修改、删除操作已经细粒化
       * 下面开始字段细粒度权限判断
       */
      // ====== 新增字段操作(复制字段也属于) ======
      if (('oi' in action) && !('od' in action)) {
        // 仅有且只有oi, 代表新加字段（或复制字段）
        this.collectByAddField(cmd, action, permission, resultSet);
        return;
      }
      // ====== 修改字段操作 ======
      if (('oi' in action) && ('od' in action)) {
        this.collectByChangeField(cmd, action, permission, resultSet);
        return;
      }
      // ====== 删除字段操作 ======
      if (!('oi' in action) && ('od' in action)) {
        this.collectByDeleteField(action, permission, resultSet);
        return;
      }
      // ===== Field操作 END =====
    } else if (action.p[1] === 'views') {
      // ===== 视图的操作 =====
      this.collectByView(action, permission, resultSet);
    } else if (action.p[1] === 'widgetPanels') {
      // ===== 组件面板的操作 =====
      // 组件面板及组件的增删均需要可管理角色
      if (!permission.manageable) {
        throw new Error('OPERATION_DENIED');
      }
    }
  }

  /**
   * @description 收集和操作行相关的 op
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
   * @description 收集和评论相关的 op
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
   * @description 处理和 RecordMap 相关的数据
   * @param {IJOTAction} action
   * @param {*} permission
   * @param resultSet
   */
  dealWithRecordMap(cmd: string, action: IJOTAction, permission: any, resultSet: { [key: string]: any }) {
    // ===== Record操作 BEGIN =====
    if (!(action.p.includes('commentCount') || action.p.includes('comments')) && action.p[0] === 'recordMap') {
      // 行数据操作
      this.collectByOperateForRow(cmd, action, permission, resultSet);
    }
    // ===== Record操作 END =====

    // ===== 收集评论操作 BEGIN ====
    if (action.n !== OTActionName.ObjectInsert && action.p.includes('comments') && action.p[0] === 'recordMap') {
      this.collectByOperateForComment(action, permission, resultSet);
    }
    // ===== 收集评论操作 END ====
  }
}

export const permissionCheck = new PermissionCheck();
