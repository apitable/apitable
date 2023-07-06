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

import { Button, Message, Typography } from '@apitable/components';
import { CollaCommandName, ExecuteResult, ITemporaryView, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { Input } from 'antd';
import styles from 'pc/components/view_lock/style.module.less';
import { IViewLockProps } from 'pc/components/view_lock/interface';
import { resourceService } from 'pc/resource_service';
import { useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { requestServerView } from '../tab_bar/view_sync_switch/popup_content';
import { store } from '../../store';

const { TextArea } = Input;

export const DisabledViewLock: React.FC<React.PropsWithChildren<Omit<IViewLockProps, 'unlockHandle'>>> = ({ viewId, onModalClose }) => {
  const areaRef = useRef(null);
  const unitId = useSelector(state => state.user.info?.unitId)!;

  const { datasheetId } = useSelector(state => state.pageParams);

  const isViewModified = useSelector(state => {
    if (!viewId) {
      return false;
    }
    return Selectors.getDatasheetClient(state)?.operateViewIds?.includes?.(viewId);
  });

  const openViewLock = async() => {
    const value = areaRef.current!['resizableTextArea']['textArea']['value'];
    if (isViewModified) {
      const serverViewDate = await requestServerView(datasheetId!, viewId);
      const { result: resultSaveView } = resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.ManualSaveView,
        viewId,
        viewProperty: serverViewDate as ITemporaryView
      });
      if (ExecuteResult.Success === resultSaveView) {
        store.dispatch(StoreActions.resetOperateViewId(viewId!, datasheetId!));
      }
    }
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetViewLockInfo,
      data: value ? { description: value, unitId: unitId } : { unitId: unitId },
      viewId,
    });
    if (ExecuteResult.Success === result) {
      Message.success({
        content: t(Strings.enabled_view_lock_success),
      });
      onModalClose();
    }
  };

  return (
    <div>
      <Typography variant={'body2'}>{t(Strings.enabled_view_lock_tip)}</Typography>
      <TextArea
        placeholder={t(Strings.view_lock_desc_placeholder)}
        autoSize={{ minRows: 1, maxRows: 6 }}
        className={styles.rcTextArea}
        ref={areaRef}
      />
      <div className={styles.buttonGroup}>
        <Button onClick={onModalClose}>{t(Strings.cancel)}</Button>
        <Button color={'primary'} onClick={openViewLock}>
          {t(Strings.lock)}
        </Button>
      </div>
    </div>
  );
};
