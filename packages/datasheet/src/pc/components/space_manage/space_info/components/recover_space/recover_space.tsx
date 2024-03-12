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

import { Modal as ModalMobile } from 'antd-mobile';
import cls from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import { Button, TextButton, useThemeColors } from '@apitable/components';
import { Api, IReduxState, Strings, t, ThemeName } from '@apitable/core';
import { UndoFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import SpaceDeleteDark from 'static/icon/common/space_delete_img_dark.png';
import SpaceDeleteLight from 'static/icon/common/space_delete_img_light.png';
import { DelSuccess } from '../del_success/del.success';
import styles from './style.module.less';

export const RecoverSpace = () => {
  const spaceInfo = useAppSelector((state: IReduxState) => state.space.curSpaceInfo);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const [delSuccess, setDelSuccess] = useState(false);
  const colors = useThemeColors();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const theme = useAppSelector((state) => state.theme);
  const DeleteIcon = theme === ThemeName.Light ? SpaceDeleteLight : SpaceDeleteDark;
  const recoverSpaceConfirm = () => {
    if (!spaceId) return;
    Api.recoverSpace(spaceId).then((res) => {
      const { success } = res.data;
      if (success) {
        window.location.reload();
      }
    });
  };
  const handleClick = () => {
    if (isMobile) {
      ModalMobile.show({
        title: t(Strings.restore_space),
        content: t(Strings.modal_restore_space),
        actions: [
          {
            text: t(Strings.cancel),
            onClick: () => ModalMobile.clear(),
            key: t(Strings.cancel),
          },
          {
            text: t(Strings.confirm),
            onClick: recoverSpaceConfirm,
            key: t(Strings.confirm),
          },
        ],
      });
      return;
    }
    Modal.confirm({
      title: t(Strings.restore_space),
      content: t(Strings.modal_restore_space),
      onOk: recoverSpaceConfirm,
      type: 'warning',
    });
  };
  const delNowConfirm = () => {
    Api.deleteSpaceNow().then((res) => {
      const { success } = res.data;
      if (success) {
        setDelSuccess(true);
      }
    });
  };
  const delNow = () => {
    if (isMobile) {
      ModalMobile.show({
        title: t(Strings.del_space_now),
        content: t(Strings.del_space_now_tip),
        actions: [
          {
            text: t(Strings.cancel),
            onClick: () => ModalMobile.clear(),
            key: t(Strings.cancel),
          },
          {
            text: t(Strings.confirm),
            onClick: delNowConfirm,
            style: { color: colors.errorColor },
            key: t(Strings.confirm),
          },
        ],
      });
      return;
    }
    Modal.confirm({
      title: t(Strings.del_space_now),
      content: t(Strings.del_space_now_tip),
      onOk: delNowConfirm,
      type: 'danger',
    });
  };
  if (!spaceInfo || !spaceInfo.delTime) {
    return <></>;
  }

  const delDate = new Date(spaceInfo.delTime);

  if (isMobile) {
    return (
      <div className={cls(styles.recoverSpace, { [styles.mobileRecoverSpace]: isMobile })}>
        <div className={styles.wrapper}>
          <Image style={{ maxWidth: 'calc(100% - 150px)' }} src={DeleteIcon} alt={t(Strings.delete_space)} />
          <div className={styles.tip}>
            {dayjs.tz(delDate).format('YYYY-MM-DD HH:mm')} {t(Strings.restore_space_confirm_delete)}
          </div>
          <div className={styles.subTip}>{t(Strings.tip_del_success)}</div>
          <Button color="primary" block onClick={handleClick} size="large" prefixIcon={<UndoFilled color="currentColor" />}>
            {t(Strings.restore_space)}
          </Button>
          <TextButton color="danger" block onClick={delNow} size="large">
            {t(Strings.delete_now)}
          </TextButton>
          {delSuccess && <DelSuccess tip={t(Strings.delete_workspace_succeed)} />}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recoverSpace}>
      <div className={styles.wrapper}>
        <Button color="primary" block onClick={handleClick} size="large" prefixIcon={<UndoFilled color="currentColor" />}>
          {t(Strings.restore_space)}
        </Button>
        <div className={styles.tip}>
          {dayjs.tz(delDate).format('YYYY-MM-DD HH:mm')} {t(Strings.restore_space_confirm_delete)}
        </div>
        <TextButton color="danger" block onClick={delNow} size="large">
          {t(Strings.delete_now)}
        </TextButton>
      </div>
      {delSuccess && <DelSuccess tip={t(Strings.delete_workspace_succeed)} />}
    </div>
  );
};
