import {
  CollaCommandName, ConfigConstant, DATASHEET_ID, Field, FieldType, ISetRecordOptions, Selectors, StoreActions, Strings, t
} from '@apitable/core';
import { ContextName, ShortcutActionName } from 'pc/common/shortcut_key/enum';
import { Message } from 'pc/components/common/message/message';
import { notify } from 'pc/components/common/notify/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { EXPAND_RECORD, expandRecordIdNavigate } from 'pc/components/expand_record';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getParentNodeByClass } from 'pc/utils/dom';
import { UploadManager } from 'pc/utils/upload_manager';
import { IContext } from './context_key_parser/context_key';
import { prependRow } from './shortcut_actions/append_row';

export const shortcutKey = (): boolean => {
  return false;
};

function hasPermissions() {
  const state = store.getState();
  const resourceId = resourceService.instance!.roomService.roomId;
  const resourceType = resourceService.instance!.getCollaEngine(resourceId)!.resourceType;
  return Selectors.getResourcePermission(state, resourceId, resourceType);
}

/**
 * 快捷键执行的上下文。用于给 config 中的 when 提供状态判断。
 * 用来给快捷键控制器判断，是否应该执行某个 action。
 * 比如，全选快捷键只应该在表格 focusing 而且非 editing 的时候的时候才生效。
 * 这时候，when = "isFocusing && !isEditing"
 * isFocusing 和 isEditing 就是取自于下面的 ShortcutContext 维护的 context 判断函数
 *
 * context 函数绑定有两种形式
 *  1. 如果状态直接存在于 store 中，则可以直接使用 selector 取到，这时候直接写在 context 对象初始化的时候就可以（参考 isFocusing)
 *  2. 如果状态只存在于组件内部 state 中
 *    1. 在下方 context 中填上预初始化占位函数 () => false
 *    2. 在存在 context 的组件中调用 bind 方法来将判断函数绑定到 context 上（参考 editorContainer.tsx 中的 isEditing)
 */
export class ShortcutContext {
  private constructor() { }

  static context: IContext = {
    [ContextName.isEditing]: () => false,
    [ContextName.isMenuOpening]: () => false,
    [ContextName.isRecordExpanding]: () => {
      const state = store.getState();
      // 侧边模式下认为卡片未展开，处理表格和展开卡片快捷键冲突问题
      if (state.space.isSideRecordOpen) return false;
      return Boolean(document.querySelectorAll(`.${EXPAND_RECORD}`).length);
    },
    [ContextName['true']]: () => true,
    [ContextName.isFocusing]: () => {
      const ele = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
      if (!ele || !document.activeElement) {
        return false;
      }

      if (
        ele.contains(document.activeElement) ||
        getParentNodeByClass(document.activeElement as HTMLElement, ConfigConstant.GIRD_CELL_EDITOR)
      ) {
        return true;
      }
      return false;
    },
    [ContextName.isGlobalEditing]: () => {
      const isEditing = ShortcutContext.context[ContextName.isEditing]();
      const isFocusing = ShortcutContext.context[ContextName.isFocusing]();

      // 聚焦在单元格上的时候, 只有进入了编辑状态才算为 true，否则属于非 globalEditing。
      if (isFocusing) {
        if (isEditing) {
          return true;
        }
        return false;
      }

      let inputFocusing = false;
      // 非单元格以外的地方，只要聚焦到 input/textarea/contentEditable 则认为是编辑状态。
      if (document.activeElement) {
        const tagName = document.activeElement.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || (document.activeElement as any).isContentEditable) {
          inputFocusing = true;
        }
      }
      return inputFocusing;
    },
    [ContextName.hasActiveCell]: () => {
      const state = store.getState();
      const datasheet = Selectors.getDatasheet(state);
      if (!Boolean(datasheet)) {
        return Boolean(datasheet);
      }
      const activeCell = Selectors.getActiveCell(state);
      return Boolean(activeCell);
    },
    [ContextName.visualizationEditable]: () => {
      console.log({ editl: hasPermissions().editable });
      return hasPermissions().editable;
    },
    [ContextName.recordEditable]: () => {
      return hasPermissions().editable;
    },
    [ContextName.modalVisible]: () => false,
  };

  static bind(key: ContextName, fn: () => boolean) {
    this.context[key] = fn;
  }

  static unbind(key: ContextName) {
    this.context[key] = () => false;
  }
}

/**
 * 管理快捷键执行时候触发的 action
 *
 * action 函数有两种
 *  1. 直接是 redux action ，或者 collaCommandManager 来执行的，不需要特定上下文，可以直接在下方 actionMap 中定义（参考Undo)
 *  2. 有组件内部状态依赖的 state action，则需要在组件中调用 bind 方法来将判断函数绑定到 actionMap 上（参考 selectionUp)
 */
export class ShortcutActionManager {
  private constructor() { }

  static actionMap = new Map<ShortcutActionName, any>([
    [ShortcutActionName.None, () => {
      console.warn('! ' + 'A shortcut action of None');
    }],
    [ShortcutActionName.ToastForSave, () => {
      Message.success({ content: t(Strings.toast_ctrl_s) });
    }],
    [ShortcutActionName.Undo, () => {
      const undoManager = getUndoManager();
      if (!undoManager) {
        return;
      }
      const undoLength = undoManager.getStockLength('undo');
      if (undoLength) {
        undoManager.undo();
        notify.open({ message: t(Strings.shortcut_key_undo), key: NotifyKey.Undo });
      } else {
        notify.open({ message: t(Strings.shortcut_key_undo_nothing), key: NotifyKey.Undo });
      }
    }],
    [ShortcutActionName.Redo, () => {
      const undoManager = getUndoManager();
      if (!undoManager) {
        return;
      }
      const redoLength = undoManager.getStockLength('redo');
      if (redoLength) {
        undoManager.redo();
        notify.open({ message: t(Strings.shortcut_key_redo), key: NotifyKey.Undo });
      } else {
        notify.open({ message: t(Strings.shortcut_key_redo_nothing), key: NotifyKey.Undo });
      }
    }],
    [ShortcutActionName.ExpandRecord, () => {
      const state = store.getState();
      const activeCell = Selectors.getActiveCell(state)!;
      expandRecordIdNavigate(activeCell.recordId);
    }],
    [ShortcutActionName.Clear, clear],
    [ShortcutActionName.PrependRow, prependRow],
    [ShortcutActionName.ToggleApiPanel, () => {
      store.dispatch(StoreActions.toggleApiPanel());
    }],
  ]);

  /**
   * 注意，绑定到 ShortcutAction 的回调函数是不能有参数的，因为快捷键按下的时候只能给出单一的状态，不存在传参的机会。
   * fn 显式的返回为 false 的时候表示不进行 preventDefault。
   */
  static bind(key: ShortcutActionName, fn: () => boolean | void) {
    this.actionMap.set(key, fn);
  }

  static unbind(key: ShortcutActionName) {
    this.actionMap.delete(key);
  }

  static trigger(key: ShortcutActionName): boolean | void {
    const fn = this.actionMap.get(key);
    const result = fn ? fn() : false;
    return result;
  }
}

const getUndoManager = () => {
  const undoManager = resourceService.instance!.undoManager!;

  if (!undoManager) {
    return;
  }

  const pageParams = store.getState().pageParams;

  // TODO: dashboard 后面需要支持 undo/redo，但因为目前不支持，所以不展示提示
  // 由于这个情况比较特殊，没有必要再增加一个属性进行配置，可以用这个暴力的方式进行判断
  if (Boolean(pageParams.dashboardId)) {
    return;
  }

  const roomId = resourceService.instance!.roomService.roomId;

  if (pageParams.nodeId !== roomId) {
    return;
  }
  return undoManager;
};

export function clear() {
  const state = store.getState();
  const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!);
  const commandManager = resourceService.instance!.commandManager;
  const uploadManager = resourceService.instance!.uploadManager;
  const data: ISetRecordOptions[] = [];
  const cellMatrixFromRange = Selectors.getCellMatrixFromSelection(state);
  if (!cellMatrixFromRange) {
    return;
  }
  const cellMatrix = cellMatrixFromRange.flat();
  if (!cellMatrix || !fieldMap) {
    return;
  }
  cellMatrix.forEach(cell => {
    const { recordId, fieldId } = cell;
    const field = fieldMap[fieldId];
    const fieldType = fieldMap[fieldId].type;
    if (Field.bindModel(field).recordEditable() && !Field.bindModel(field).isComputed) {
      if (fieldType === FieldType.Attachment) {
        const cellId = UploadManager.getCellId(recordId, fieldId);
        uploadManager.clearFailQueue(cellId);
      }
      // TODO: 上了列权限之后，这里要判断一下是否有列的编辑器权限
      data.push({
        recordId,
        fieldId,
        value: null,
      });
    }
  });
  data.length && notify.open({
    message: t(Strings.clear_cell_by_count, {
      count: data.length,
    }),
    btnText: t(Strings.undo),
    key: NotifyKey.ClearRecordData,
    btnFn() {
      ShortcutActionManager.trigger(ShortcutActionName.Undo);
      notify.close(NotifyKey.ClearRecordData);
    },
  });

  commandManager.execute({
    cmd: CollaCommandName.SetRecords,
    data,
  });
}
