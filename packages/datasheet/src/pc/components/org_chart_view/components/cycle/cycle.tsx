import { FC, useEffect } from 'react';
import ReactFlow, { Elements, PanOnScrollMode, useZoomPanHelper } from '@vikadata/react-flow-renderer';
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
export const Cycle: FC<ICycle> = ({ elements }) => {
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
          [NodeType.CustomCycleEdge]: CustomCycleEdge,
          [NodeType.CustomEdge]: CustomEdge
        }}
        nodeTypes={{
          [NodeType.CycleNode]: CycleNode
        }}
        panOnScrollSpeed={1}
        arrowHeadColor={colors.errorColor}
        onlyRenderVisibleElements
        panOnScrollMode={PanOnScrollMode.Vertical}
      />
    </div>
  );
};
