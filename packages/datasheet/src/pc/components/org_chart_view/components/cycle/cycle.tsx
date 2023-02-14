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

import { FC, useEffect, PropsWithChildren } from 'react';
import ReactFlow, { Elements, PanOnScrollMode, useZoomPanHelper } from '@apitable/react-flow';
import { CustomCycleEdge } from '../custom/custom_cycle_edge';
import { CycleNode } from '../custom/cycle_node';
import { CustomEdge } from '../custom';
import { Typography, useThemeColors } from '@apitable/components';
import styles from './styles.module.less';
import { Strings, t } from '@apitable/core';
import { NodeType } from '../../constants';

interface ICycle {
  elements: Elements;
}
export const Cycle: FC<PropsWithChildren<ICycle>> = ({ elements }) => {
  const colors = useThemeColors();
  const {
    fitView,
    zoomTo,
  } = useZoomPanHelper();

  useEffect(() => {
    fitView();
    zoomTo(1);
  });

  return (
    <div className={styles.cycleFlow}>
      <Typography variant='h7'>
        {t(Strings.org_chart_err_head)}
      </Typography>
      <Typography variant='body4' style={{ marginTop: 8, color: colors.fc3 }}>
        {t(Strings.org_chart_err_title)}
      </Typography>
      <ReactFlow
        elements={elements}
        panOnScroll
        zoomActivationKeyCode=""
        paneMoveable={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        preventScrolling={false}
        selectionKeyCode=""
        edgeTypes={{
          [NodeType.CustomCycleEdge]: CustomCycleEdge as any,
          [NodeType.CustomEdge]: CustomEdge as any
        }}
        nodeTypes={{
          [NodeType.CycleNode]: CycleNode as any
        }}
        panOnScrollSpeed={1}
        arrowHeadColor={colors.errorColor}
        onlyRenderVisibleElements
        panOnScrollMode={PanOnScrollMode.Vertical}
      />
    </div>
  );
};
