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

import { IconButton, LinkButton, Message, Typography, useThemeColors } from '@apitable/components';
import {
  CollaCommandName, ExecuteResult, ITemporaryView, ResourceType, Selectors, StoreActions, Strings, t, ViewPropertyFilter
} from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import styles from 'pc/components/tab_bar/view_sync_switch/style.module.less';
import { expandViewLock } from 'pc/components/view_lock/expand_view_lock';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';

interface IPopupContentProps {
  autoSave: boolean;
  datasheetId: string;
  viewId: string;
  onClose: (value?: (boolean | undefined)) => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null> | null;
  isViewLock: boolean;
  shareId?: string;
}

export const requestServerView = async(datasheetId: string, viewId: string, shareId?: string) => {
  const { success, data, message } = await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
  const state = store.getState();
  if (success) {
    const revision = Selectors.getResourceRevision(state, datasheetId, ResourceType.Datasheet);

    if (data['revision'] < revision!) {
      // The database version is smaller than the local version, 
      // probably because the op is being processed at the same time as the request, so a new request is sent
      return await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
    }

    if (data['revision'] > revision!) {
      // If the local version is smaller than the database version, you should make up the version number before replacing the data
      const engine = resourceService.instance?.getCollaEngine(datasheetId);
      await engine?.checkMissChanges(data['revision']);
      return await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
    }

    return data['view'];
  }
  Message.error({ content: message });
};

export const changeViewAutoSave = async(autoSave: boolean, datasheetId: string, viewId: string, shareId?: string) => {
  const _autoSave = !autoSave;
  const baseOption = {
    cmd: CollaCommandName.SetViewAutoSave,
    viewId: viewId!,
    autoSave: _autoSave,
  };
  const serverViewDate = _autoSave ? await requestServerView(datasheetId!, viewId, shareId) : undefined;
  const { result } = resourceService.instance!.commandManager.execute((_autoSave ? { ...baseOption, viewProperty: serverViewDate } : baseOption) as any);
  
  if (ExecuteResult.Success === result) {
    store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
    Message.success({
      content: _autoSave ? t(Strings.open_auto_save_success) : t(Strings.close_auto_save_success)
    });
  }
};

export const confirmViewAutoSave = (autoSave: boolean, datasheetId: string, viewId: string, shareId?: string) => {
  // const isViewLock = Selectors.getCurrentView(store.getState(), datasheetId)?.lockInfo;
  const snapshot = Selectors.getSnapshot(store.getState(), datasheetId)!;
  const isViewLock = Selectors.getViewById(snapshot, viewId)?.lockInfo;

  if (isViewLock) {
    return expandViewLock(viewId, () => {
      changeViewAutoSave(autoSave, datasheetId, viewId, shareId);
    });
  }

  Modal.warning({
    title: autoSave ? t(Strings.close_auto_save_warn_title) : t(Strings.open_auto_save_warn_title),
    content: autoSave ? t(Strings.close_auto_save_warn_content) : t(Strings.open_auto_save_warn_content),
    onOk: () => {changeViewAutoSave(autoSave, datasheetId, viewId, shareId);},
    closable: true
  });
};

export const PopupContent: React.FC<React.PropsWithChildren<IPopupContentProps>> = (props) => {
  const colors = useThemeColors();
  const { datasheetId, viewId, autoSave, onClose, contentRef, shareId, isViewLock } = props;
  // TODO: Replace the permissions here with more granular ones
  const { manageable, editable } = useSelector(state => Selectors.getPermissions(state, datasheetId));
  const manualSaveView = async() => {
    if (isViewLock) {
      expandViewLock(viewId);
      return;
    }
    onClose();
    if (autoSave) {
      return;
    }
    const serverViewDate = await requestServerView(datasheetId!, viewId, shareId);
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ManualSaveView,
      viewId: viewId!,
      viewProperty: serverViewDate as ITemporaryView
    });
    if (ExecuteResult.Success === result) {
      store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
      Message.success({
        content: t(Strings.view_property_sync_success)
      });
    }
  };

  const _changeViewAutoSync = () => {
    if (isViewLock) {
      expandViewLock(viewId);
      return;
    }
    onClose();
    confirmViewAutoSave(autoSave, datasheetId, viewId);
  };

  return <div className={styles.content} ref={contentRef} onDoubleClick={stopPropagation}>
    <IconButton
      size={'small'}
      className={styles.closeIcon}
      icon={() => <CloseOutlined color={colors.thirdLevelText} />}
      onClick={() => {onClose();}}
    />
    <Typography variant={'h7'} style={{ marginBottom: 8 }}>
      {t(autoSave ? Strings.auto_save_has_been_opend : Strings.view_property_sync_title)}
    </Typography>
    <Typography variant={'body4'} style={{ marginBottom: 16 }}>
      {autoSave ? t(Strings.auto_save_has_been_opend_content) : t(Strings.view_property_sync_content)}
    </Typography>
    <div className={styles.footer}>
      {
        manageable ? <LinkButton onClick={_changeViewAutoSync} className={styles.borderNone}>
          <Typography variant={'body4'}>
            {t(autoSave ? Strings.close_auto_save : Strings.auto_save_view_property)}
          </Typography>
        </LinkButton> : <span />
      }
      {
        editable && <LinkButton color={'primary'} onClick={manualSaveView} className={styles.borderNone}>
          <Typography variant={'body2'} color={colors.primaryColor}>
            {t(autoSave ? Strings.ensure : Strings.manual_save_view)}
          </Typography>
        </LinkButton>
      }
    </div>
  </div>;
};
