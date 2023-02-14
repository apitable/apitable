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

import { Strings, t } from '@apitable/core';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC } from 'react';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });

interface ILoading {
  style?: React.CSSProperties;
}
export const Loading: FC<React.PropsWithChildren<ILoading>> = ({ style }) => {
  return (
    <div className={styles.loadingWrapper} style={style}>
      <Spin
        tip={t(Strings.loading)}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    </div>
  );
};
