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
import { useThemeColors } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { WarnCircleFilled } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './styles.module.less';

export const Reconnecting: React.FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const reconnecting = useAppSelector((state) => {
    return state.space.reconnecting;
  });
  return (
    <Modal
      wrapClassName={styles.modalWrapper}
      destroyOnClose
      visible={reconnecting}
      width={300}
      mask={false}
      closable={false}
      maskClosable={false}
      style={{
        pointerEvents: 'none',
      }}
      footer={null}
      title={
        <>
          <WarnCircleFilled color={colors.warningColor} /> {t(Strings.disconnect_from_the_server)}
        </>
      }
    >
      {t(Strings.try_my_best_effort_to_reconnect)}
    </Modal>
  );
};
