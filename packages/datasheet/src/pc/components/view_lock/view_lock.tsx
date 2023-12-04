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

import { Modal } from 'antd';
import * as React from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { DisabledViewLock } from 'pc/components/view_lock/disabled_view_lock';
import { EnabledViewLock } from 'pc/components/view_lock/enabled_view_lock';
import { useAppSelector } from 'pc/store/react-redux';
import { IViewLockProps } from './interface';
import styles from './style.module.less';

export const ViewLock: React.FC<React.PropsWithChildren<IViewLockProps>> = (props) => {
  const colors = useThemeColors();
  const { viewId, onModalClose, unlockHandle } = props;
  const view = useAppSelector((state) => {
    const datasheetId = state.pageParams.datasheetId;
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    return Selectors.getViewById(snapshot, viewId);
  })!;
  const isViewLocked = Boolean(view?.lockInfo);

  const Title = () => {
    return (
      <div className={styles.modalTitle}>
        <div>
          <Typography variant={'h6'}>{isViewLocked ? t(Strings.un_lock_view) : t(Strings.lock_view)}</Typography>
        </div>
        <div>
          <CloseOutlined color={colors.fourthLevelText} onClick={onModalClose} size={24} />
        </div>
      </div>
    );
  };

  return (
    <Modal
      visible
      closeIcon={null}
      wrapClassName={styles.viewLockModal}
      onCancel={onModalClose}
      destroyOnClose
      footer={null}
      centered
      width={400}
      title={<Title />}
      maskClosable
    >
      {isViewLocked ? (
        <EnabledViewLock view={view} onModalClose={onModalClose} unlockHandle={unlockHandle} />
      ) : (
        <DisabledViewLock viewId={view.id} onModalClose={onModalClose} />
      )}
    </Modal>
  );
};
