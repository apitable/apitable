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

import classnames from 'classnames';
import React from 'react';
import { GlobalContextProvider } from '@apitable/widget-sdk';
import { WidgetBlock } from './widget/widget_block';
import WidgetAlone from './widget_alone';
import styles from './style.module.less';

export const Main: React.FC<React.PropsWithChildren<unknown>> = () => {
  const query = new URLSearchParams(window.location.search);
  const isAlone = query.get('isAlone');
  const widgetId = query.get('widgetId');
  if (!widgetId && !isAlone) {
    return <>No widgetId</>;
  }
  return (
    <div className={classnames(styles.main, 'main')}>
      {!isAlone ? (
        <WidgetBlock widgetId={widgetId!} />
      ) : (
        <GlobalContextProvider>
          <WidgetAlone />
        </GlobalContextProvider>
      )}
    </div>
  );
};
