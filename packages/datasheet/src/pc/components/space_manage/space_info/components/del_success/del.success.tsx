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

import { useMount } from 'ahooks';
import { Modal } from 'antd';
import { FC, useState } from 'react';
import { Navigation, Strings, t } from '@apitable/core';
import { CheckCircleFilled, CloseOutlined } from '@apitable/icons';
import { Router } from 'pc/components/route_manager/router';
import styles from './style.module.less';

interface IResModal {
  tip: string;
}

export const DelSuccess: FC<React.PropsWithChildren<IResModal>> = ({ tip }) => {
  const [timer, setTimer] = useState<number>();
  // const dispatch = useDispatch();

  useMount(() => {
    const timeout = setTimeout(() => {
      // dispatch(StoreActions.setActiveSpaceId(''));
      Router.redirect(Navigation.HOME);
    }, 3000);
    setTimer(timeout as any as number);
  });

  const onCancel = () => {
    clearTimeout(timer);
    // dispatch(StoreActions.setActiveSpaceId(''));
    Router.redirect(Navigation.HOME);
  };

  return (
    <Modal
      visible
      footer={null}
      width={390}
      maskClosable={false}
      bodyStyle={{ padding: '24px' }}
      centered
      onCancel={onCancel}
      closeIcon={<CloseOutlined />}
    >
      <div className={styles.delSuccess}>
        <CheckCircleFilled size={70} color="#52C41A" />
        <div className={styles.title}>{t(Strings.delete_succeed)}</div>
        <div className={styles.tip}>{tip}</div>
      </div>
    </Modal>
  );
};
