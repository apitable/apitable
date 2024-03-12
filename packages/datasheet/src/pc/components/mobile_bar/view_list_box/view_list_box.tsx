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

import classNames from 'classnames';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Selectors, t, Strings } from '@apitable/core';
import { CheckCircleFilled } from '@apitable/icons';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { changeView } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IViewListBox {
  displayState: boolean;
  hideViewList: () => void;
}

export const ViewListBox: React.FC<React.PropsWithChildren<IViewListBox>> = (props) => {
  const colors = useThemeColors();
  const { hideViewList, displayState } = props;
  const snapshot = useAppSelector((state) => Selectors.getSnapshot(state));
  const activeViewId = useAppSelector((state) => Selectors.getActiveViewId(state));

  const switchView = (id: string) => {
    if (activeViewId === id) {
      hideViewList();
      return;
    }
    changeView(id);
    hideViewList();
  };

  return (
    <>
      <div
        className={classNames({
          [styles.active]: displayState,
          [styles.viewList]: true,
        })}
      >
        <h2>{t(Strings.view_list)}</h2>
        {snapshot &&
          snapshot.meta.views.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => switchView(item.id)}
                className={classNames({
                  [styles.viewItem]: true,
                  [styles.active]: item.id === activeViewId,
                })}
              >
                <ViewIcon viewType={item.type} />
                <span>{item.name}</span>
                {item.id === activeViewId && <CheckCircleFilled color={colors.primaryColor} />}
              </div>
            );
          })}
      </div>
      <div className={classNames({ [styles.active]: displayState, [styles.mask]: true })} onClick={hideViewList} />
    </>
  );
};
