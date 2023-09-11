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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { ITheme } from '@apitable/components';
import { Rect } from 'pc/components/konva_components';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

const Status = (props: { x: number; KONVA_DATASHEET_ID: any; containerHeight: number; theme: ITheme }) => {
  const { x, KONVA_DATASHEET_ID, containerHeight, theme } = props;
  return (
    <Group x={x} listening={false}>
      <Rect name={KONVA_DATASHEET_ID.GANTT_HOVER_SPLITTER} width={2} height={containerHeight} fill={theme.color.primaryColor} />
    </Group>
  );
};

export default Status;
