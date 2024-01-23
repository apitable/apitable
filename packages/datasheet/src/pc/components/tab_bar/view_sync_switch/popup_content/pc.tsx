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

import * as React from 'react';
import { Button, IconButton, LinkButton, Message, Typography, useThemeColors } from '@apitable/components';
import { CollaCommandName, ExecuteResult, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { resourceService } from '../../../../resource_service';
import { store } from '../../../../store';
import { stopPropagation } from '../../../../utils';
import { Modal } from '../../../common';
import { expandViewLock } from '../../../view_lock/expand_view_lock';
import { cancelModification, IViewPropertyUpdateProps, modifyViewProperty } from '../request_view_property_change';
import styles from '../style.module.less';
import { requestServerView } from './request_server_view';

interface IPopupContentProps extends IViewPropertyUpdateProps {
  contentRef: React.MutableRefObject<HTMLDivElement | null> | null;
  shareId?: string;
}

export const changeViewAutoSave = async (autoSave: boolean, datasheetId: string, viewId: string, shareId?: string) => {
  const _autoSave = !autoSave;
  const baseOption = {
    cmd: CollaCommandName.SetViewAutoSave,
    viewId: viewId!,
    autoSave: _autoSave,
  };
  const serverViewDate = _autoSave ? await requestServerView(datasheetId!, viewId, shareId) : undefined;
  const { result } = resourceService.instance!.commandManager.execute(
    (_autoSave ? { ...baseOption, viewProperty: serverViewDate } : baseOption) as any,
  );

  if (ExecuteResult.Success === result) {
    store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
    Message.success({
      content: _autoSave ? t(Strings.open_auto_save_success) : t(Strings.close_auto_save_success),
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
    onOk: () => {
      changeViewAutoSave(autoSave, datasheetId, viewId, shareId);
    },
    closable: true,
  });
};

export const PopupContent: React.FC<React.PropsWithChildren<IPopupContentProps>> = (props) => {
  const colors = useThemeColors();
  const { datasheetId, viewId, autoSave, onClose, contentRef, shareId, isViewLock } = props;
  // TODO: Replace the permissions here with more granular ones
  const { editable } = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));

  const viewPropertyProps = {
    autoSave: autoSave,
    datasheetId: datasheetId!,
    viewId: viewId!,
    onClose,
    shareId,
    isViewLock,
  };

  return (
    <div className={styles.content} ref={contentRef} onDoubleClick={stopPropagation}>
      <IconButton
        size={'small'}
        className={styles.closeIcon}
        icon={() => <CloseOutlined color={colors.thirdLevelText} />}
        onClick={() => {
          onClose();
        }}
      />
      <Typography ellipsis className={styles.title} variant={'h7'} style={{ marginBottom: 8 }}>
        {t(autoSave ? Strings.auto_save_has_been_opend : Strings.view_property_sync_title)}
      </Typography>
      <Typography variant={'body4'} style={{ marginBottom: 16 }}>
        {autoSave ? t(Strings.auto_save_has_been_opend_content) : t(Strings.view_property_sync_content)}
      </Typography>
      <div className={styles.footer}>
        <LinkButton onClick={() => cancelModification(viewPropertyProps)} className={styles.borderNone}>
          <Typography variant={'body4'} className={styles.cancelText}>
            {t(Strings.revoke_changes)}
          </Typography>
        </LinkButton>
        {editable && (
          <Button color="primary" size={'small'} onClick={() => modifyViewProperty(viewPropertyProps)} className={styles.borderNone}>
            {t(Strings.save_this_modified)}
          </Button>
        )}
      </div>
    </div>
  );
};
