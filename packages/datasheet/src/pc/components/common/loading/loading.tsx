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

import { Spin } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { FC } from 'react';
import { Strings, t } from '@apitable/core';
import { LoadingOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export interface ILoadingProps {
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Loading: FC<React.PropsWithChildren<ILoadingProps>> = (props) => {
  const { showText = true, style, className } = props;
  const shareId = useAppSelector((state) => state.pageParams.shareId);
  return (
    <div
      className={classNames(styles.loading, className)}
      style={{
        top: shareId ? 16 : 0,
        bottom: shareId ? 16 : 0,
        borderRadius: shareId ? 8 : 0,
        ...style,
      }}
    >
      <Spin tip={showText ? t(Strings.loading) : ''} indicator={<LoadingOutlined size={24} className="circle-loading" />} />
    </div>
  );
};
