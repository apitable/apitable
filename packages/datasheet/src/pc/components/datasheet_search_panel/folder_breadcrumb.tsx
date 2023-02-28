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

import { IParent } from '@apitable/core';
import { Breadcrumb } from 'antd';
import { HorizontalScroll } from 'pc/components/common';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import RightArrowIcon from 'static/icon/common/common_icon_level_right.svg';

interface IFolderBreadcrumbProps {
  parents: IParent[];
  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string): void,
}

export const FolderBreadcrumb: React.FC<React.PropsWithChildren<IFolderBreadcrumbProps>> = (props) => {
  const colors = useThemeColors();
  const { parents, onNodeClick } = props;
  return (
    <div className={styles.breadCrumb}>
      <HorizontalScroll>
        <Breadcrumb
          separator={<RightArrowIcon width={10} height={10} fill={colors.thirdLevelText} />}
        >
          {
            parents.map(breadItem => (
              <Breadcrumb.Item
                key={breadItem.nodeId || breadItem.nodeName}
                onClick={() => onNodeClick('Folder', breadItem.nodeId!)}
                className={styles.folderBreadItem}
              >
                {breadItem.nodeName}
              </Breadcrumb.Item>
            ),
            )
          }
        </Breadcrumb>
      </HorizontalScroll>
    </div>
  );
};
