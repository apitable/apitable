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

import { connect } from 'react-redux';
import { Skeleton } from '@apitable/components';
import { IReduxState, Selectors } from '@apitable/core';
import { View } from '../view';
import styles from './style.module.less';
export interface ITableViewProps {
  loading: boolean;
}

export const ViewContainerBase = (props: ITableViewProps) => {
  return (
    <>
      {props.loading ? (
        <div className={styles.skeletonWrapper}>
          <Skeleton height="24px" />
          <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
        </div>
      ) : (
        <View />
      )}
    </>
  );
};

export const ViewContainer = connect((state: IReduxState) => {
  const datasheet = Selectors.getDatasheet(state);
  const viewPrepared = Selectors.getViewDerivatePrepared(state);

  return {
    loading: !datasheet || datasheet.isPartOfData || !viewPrepared,
  };
})(ViewContainerBase as any) as any;
