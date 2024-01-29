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

import { FC } from 'react';
import { IViewProperty, t, Strings } from '@apitable/core';
import { ViewItem } from './view_item';
import styles from './style.module.less';

interface IViewFilterProps {
  viewsList: IViewProperty[];
  [key: string]: any;
}

export const ViewFilter: FC<React.PropsWithChildren<IViewFilterProps>> = (props) => {
  const { viewsList, ...rest } = props;

  return (
    <>
      {viewsList.length > 0 && (
        <div className={styles.viewList}>
          {viewsList.map((view, index) => (
            <div className={styles.viewItem} key={view.id}>
              <ViewItem currentViewId={view.id} currentViewName={view.name} currentViewIndex={index} viewType={view.type} {...(rest as any)} />
            </div>
          ))}
        </div>
      )}
      {!viewsList.length && <div className={styles.viewListEmpty}>{t(Strings.no_view_find)}</div>}
    </>
  );
};
