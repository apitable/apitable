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

import * as React from 'react';
import classNames from 'classnames';
import styles from './style.module.less';
import { useThemeColors } from '@apitable/components';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { DatasheetOutlined, MirrorOutlined } from '@apitable/icons';

const Budget: React.FC<React.PropsWithChildren<unknown>> = props => {
  return (
    <div className={styles.budget}>
      {props.children}
    </div>
  );
};

export const File: React.FC<React.PropsWithChildren<{
  disable?: { budget: string, message: string },
  active?: boolean,
  id: string,
  onClick?: (id: string) => void,
  richContent?: boolean,
  isMirror?: boolean
}>> = props => {
  const colors = useThemeColors();
  const { children, disable, id, onClick, richContent, active, isMirror } = props;
  return (
    <WrapperTooltip wrapper={Boolean(disable)} tip={disable ? disable.message : ''} style={{ display: 'block' }}>
      <div className={styles.nodeContainerWrapper}>
        <div
          className={classNames(styles.nodeContainer, {
            [styles.disable]: Boolean(disable),
            [styles.active]: active,
          })}
          onClick={() => !disable && onClick && onClick(id)}
        >
          {
            isMirror ? <MirrorOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} /> :
              <DatasheetOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />
          }

          {richContent ?
            <span className={styles.text} dangerouslySetInnerHTML={{ __html: children as string }} /> :
            <span className={styles.text}>{children}</span>
          }
          {disable && <Budget>{disable.budget}</Budget>}
        </div>
      </div>
    </WrapperTooltip>
  );
};
