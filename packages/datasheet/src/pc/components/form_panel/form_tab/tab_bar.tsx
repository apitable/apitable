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

import { Space } from 'antd';
import { FC, SetStateAction, Dispatch } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Skeleton } from '@apitable/components';
import { FormTab } from './form_tab';
import styles from './style.module.less';

export const TabBar: FC<
  React.PropsWithChildren<{
    loading: boolean;
    setPreFill: Dispatch<SetStateAction<boolean>>;
    preFill: boolean;
  }>
> = ({ loading, setPreFill, preFill }) => {
  return (
    <div className={styles.tabBarWrapper}>
      {loading ? (
        <Space style={{ margin: '8px 20px' }}>
          <Skeleton style={{ height: 24, width: 340, marginTop: 0 }} />
        </Space>
      ) : (
        <AutoSizer style={{ width: '100%', height: '100%' }}>{() => <FormTab setPreFill={setPreFill} preFill={preFill} />}</AutoSizer>
      )}
    </div>
  );
};
