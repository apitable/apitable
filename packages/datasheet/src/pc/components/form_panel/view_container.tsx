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

import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '@apitable/components';
import { FormContainer } from '../form_container';
import styles from './style.module.less';

export const ViewContainer = (props: { loading?: boolean; preFill: boolean; setPreFill: Dispatch<SetStateAction<boolean>> }) => {
  if (props.loading) {
    return (
      <div className={styles.skeletonWrapper}>
        <Skeleton height="24px" />
        <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
      </div>
    );
  }

  return <FormContainer preFill={props.preFill} setPreFill={props.setPreFill} />;
};
