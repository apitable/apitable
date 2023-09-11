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
import { ContextMenu, useContextMenu, useThemeColors } from '@apitable/components';
import { KONVA_DATASHEET_ID, t, Strings } from '@apitable/core';
import { CopyOutlined } from '@apitable/icons';

import { copy2clipBoard, flatContextData } from 'pc/utils';
import { stopPropagation } from 'pc/utils/dom';
import { MouseDownType } from '../../../multi_grid';
import { IFieldBoundary } from '../stat_menu';

interface IStatRightClickMenuProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getBoundary: (e: any) => IFieldBoundary | null;
}

/**
 * The right-click menu of the statistics column
 * An alternative to konva-generated canvas that does not support scratching
 */
export const StatRightClickMenu = ({ parentRef, getBoundary }: IStatRightClickMenuProps): JSX.Element => {
  const [statText, setStatText] = React.useState('');
  const colors = useThemeColors();
  const { show } = useContextMenu({ id: KONVA_DATASHEET_ID.GRID_STAT_RIGHT_CLICK_MENU });

  const showMenu = (e: any) => {
    if (e.button === MouseDownType.Left) return;

    const fieldBoundary = getBoundary(e);
    if (!fieldBoundary) return;

    const _statText = sessionStorage.getItem('selected_state');
    setStatText(_statText || '');

    const { x, y } = fieldBoundary;
    show(e, {
      id: KONVA_DATASHEET_ID.GRID_STAT_RIGHT_CLICK_MENU,
      position: {
        x,
        y,
      },
    });
  };

  const onCopy = () => {
    if (!statText) return;

    copy2clipBoard(statText);
  };

  React.useEffect(() => {
    const element = parentRef?.current;
    if (!element) return;

    element.addEventListener('contextmenu', showMenu);
    return () => {
      element.removeEventListener('contextmenu', showMenu);
    };
  });

  return (
    <div onMouseDown={stopPropagation} onWheel={stopPropagation} onContextMenu={(e) => e.preventDefault()}>
      <ContextMenu
        menuId={KONVA_DATASHEET_ID.GRID_STAT_RIGHT_CLICK_MENU}
        overlay={flatContextData(
          [
            [
              {
                icon: <CopyOutlined color={colors.thirdLevelText} />,
                text: t(Strings.copy_link),
                onClick: () => onCopy(),
                disabled: !statText,
              },
            ],
          ],
          true,
        )}
        width={150}
        menuOffset={[0, -35]}
        // style={{
        //   minWidth: 150,
        //   padding: 0,
        //   transform: 'translateY(-35px)',
        //   width: 150,
        // }}
      />
    </div>
  );
};
