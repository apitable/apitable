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

import { isEmpty } from 'lodash';
import {
  CollaCommandName,
  ConfigConstant,
  DATASHEET_ID,
  Field,
  FieldType,
  ISetRecordOptions,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { ContextName, ShortcutActionName } from 'modules/shared/shortcut_key/enum';
import { Message } from 'pc/components/common/message/message';
import { notify } from 'pc/components/common/notify/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { EXPAND_RECORD } from 'pc/components/expand_record/expand_record.enum';
import { expandRecordIdNavigate } from 'pc/components/expand_record/utils';
import { string2Query } from 'pc/components/form_container/util';
import { EXPAND_SEARCH } from 'pc/components/quick_search/const';
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
 * The context in which the shortcut is executed. Used to provide a status judgement for when in config.
 * This is used to give the shortcut controller the ability to determine whether an action should be executed.
 * For example, the Select All shortcut should only work when the form is focusing and not editing.
 * when = "isFocusing && !isEditing"
 * isFocusing and isEditing are taken from the following context determination functions maintained by ShortcutContext
 *
 * There are two forms of context function binding
 *  1. If the state exists directly in the store, it can be fetched directly using the selector,
 *  which can be written directly to the context object when it is initialised (see isFocusing)
 *  2. If the state exists only in the internal state of the component
 *    1. Fill in the context below with the pre-initialized placeholder function () => false
 *    2. Call the bind method in a component where a context exists to bind the judgement function
 *       to the context (see isEditing in editorContainer.tsx)
 */
export class ShortcutContext {
  private constructor() {}

  static context: IContext = {
    [ContextName.isEditing]: () => false,
    [ContextName.isMenuOpening]: () => false,
    [ContextName.isRecordExpanding]: () => {
      const state = store.getState();
      // Handling of table and expanded card shortcuts conflicts when cards are considered unexpanded in side mode
      if (state.space.isSideRecordOpen) return false;
      return Boolean(document.querySelectorAll(`.${EXPAND_RECORD}`).length);
    },
    [ContextName['true']]: () => true,
    [ContextName.isFocusing]: () => {
      const ele = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
      if (!ele || !document.activeElement) {
        return false;
      }

      if (ele.contains(document.activeElement) || getParentNodeByClass(document.activeElement as HTMLElement, ConfigConstant.GIRD_CELL_EDITOR)) {
        return true;
      }
      return false;
    },
    [ContextName.isGlobalEditing]: () => {
      const isEditing = ShortcutContext.context[ContextName.isEditing]();
      const isFocusing = ShortcutContext.context[ContextName.isFocusing]();

      // When focusing on a cell, it is only true if it is in the editing state, otherwise it is not globalEditing.
      if (isFocusing) {
        if (isEditing) {
          return true;
        }
        return false;
      }

      let inputFocusing = false;
      // Anywhere other than a cell that is focused on input/textarea/contentEditable is considered editable.
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
    [ContextName.isQuickSearchExpanding]: () => {
      return Boolean(document.querySelectorAll(`.${EXPAND_SEARCH}`).length);
    },
  };

  static bind(key: ContextName, fn: () => boolean) {
    this.context[key] = fn;
  }

  static unbind(key: ContextName) {
    this.context[key] = () => false;
  }
}

/**
 * Manage the action triggered when a shortcut is executed
 *
 * action There are two types of functions
 *  1. Directly executed by the redux action, or collaCommandManager, without a specific context,
 *     can be defined directly in the actionMap below (see Undo)
 *  2. If you have a component internal state dependent state action,
 *     you need to call the bind method in the component to bind the judgment function to the actionMap (see selectionUp)
 */
export class ShortcutActionManager {
  private constructor() {}

  static actionMap = new Map<ShortcutActionName, () => boolean | void | Promise<boolean | void>>([
    [
      ShortcutActionName.None,
      () => {
        console.warn('! ' + 'A shortcut action of None');
      },
    ],
    [
      ShortcutActionName.ToastForSave,
      () => {
        Message.success({ content: t(Strings.toast_ctrl_s) });
      },
    ],
    [
      ShortcutActionName.Undo,
      () => {
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
      },
    ],
    [
      ShortcutActionName.Redo,
      () => {
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
      },
    ],
    [
      ShortcutActionName.ExpandRecord,
      () => {
        const state = store.getState();
        const activeCell = Selectors.getActiveCell(state)!;
        expandRecordIdNavigate(activeCell.recordId);
      },
    ],
    [ShortcutActionName.Clear, clear],
    [ShortcutActionName.PrependRow, () => prependRow().then(() => true)],
    [
      ShortcutActionName.ToggleApiPanel,
      () => {
        store.dispatch(StoreActions.toggleApiPanel());
      },
    ],
  ]);

  /**
   * Note that a callback function bound to a ShortcutAction cannot have parameters,
   * as the shortcut key press can only give a single state and there is no opportunity to pass parameters.
   * fn An explicit return of false means that preventDefault is not performed.
   */
  static bind(key: ShortcutActionName, fn: () => boolean | void) {
    this.actionMap.set(key, fn);
  }

  static unbind(key: ShortcutActionName) {
    this.actionMap.delete(key);
  }

  static async trigger(key: ShortcutActionName): Promise<boolean | void> {
    const fn = this.actionMap.get(key);
    return fn ? await fn() : false;
  }
}

const getUndoManager = () => {
  const undoManager = resourceService.instance!.undoManager!;

  if (!undoManager) {
    return;
  }

  const pageParams = store.getState().pageParams;

  // TODO: dashboard The undo/redo support is required at the back, but as it is not currently supported, no hint is shown
  // As this is a special case, there is no need to add another attribute for configuration and this brute force can be used to determine
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
  const query = string2Query();
  const state = store.getState();
  const recordId = query.recordId as string | undefined;
  const fieldId = query.fieldId as string | undefined;
  if (recordId && fieldId) {
    const snapshot = Selectors.getSnapshot(state)!;
    const fieldMap = snapshot.meta?.fieldMap;
    const fieldType = fieldMap[fieldId]?.type;
    const cv = Selectors.getCellValue(state, snapshot, recordId, fieldId);
    if (fieldType === FieldType.WorkDoc && !isEmpty(cv)) {
      return;
    }
  }
  console.log('query', query);
  const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!);
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
  cellMatrix.forEach((cell) => {
    const { recordId, fieldId } = cell;
    const field = fieldMap[fieldId];
    const fieldType = fieldMap[fieldId].type;
    if (Field.bindModel(field).recordEditable() && !Field.bindModel(field).isComputed) {
      if (fieldType === FieldType.Attachment) {
        const cellId = UploadManager.getCellId(recordId, fieldId);
        uploadManager.clearFailQueue(cellId);
      }
      // TODO: Once the column permissions are on, here's how to determine if you have editor permissions for the column
      data.push({
        recordId,
        fieldId,
        value: null,
      });
    }
  });
  data.length &&
    notify.open({
      message: t(Strings.clear_cell_by_count, {
        count: data.length,
      }),
      btnText: t(Strings.undo),
      key: NotifyKey.ClearRecordData,
      async btnFn(): Promise<void> {
        await ShortcutActionManager.trigger(ShortcutActionName.Undo);
        notify.close(NotifyKey.ClearRecordData);
      },
    });

  resourceService.instance!.commandManager.execute({
    cmd: CollaCommandName.SetRecords,
    data,
  });
}
