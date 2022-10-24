import { FC, useContext } from 'react';
import { EdgeProps, getEdgeCenter, getMarkerEnd, useStoreState } from '@vikadata/react-flow-renderer';
import { CollaCommandName, Strings, t } from '@apitable/core';
import { IconButton, useThemeColors } from '@vikadata/components';
import { resourceService } from 'pc/resource_service';
import { FlowContext } from '../../context/flow_context';
import { DeleteOutlined } from '@vikadata/icons';
import { Tooltip } from 'antd';
import styles from './styles.module.less';

const foreignObjectSize = 40;

export const CustomCycleEdge: FC<EdgeProps> = ({
  id,
  sourceX: x1,
  sourceY: y1,
  targetX: x2,
  targetY: y2,
  arrowHeadType,
  markerEndId,
  source,
  target,
}) => {
  const colors = useThemeColors();
  const edgePath = `M ${x1},${y1}L ${x1},${y1 + 40}L ${x1 + 80},${y1 + 40}L ${x1 + 80},${y2 - 40}L ${x2},${y2 - 40}L ${x2},${y2}`;

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX: x1,
    sourceY: y1,
    targetX: x2,
    targetY: y2,
  });

  const { datasheetId, orgChartStyle: { linkFieldId }} = useContext(FlowContext);

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const nodes = useStoreState(state => state.nodes);

  const handleDelete = () => {
    const sourceNode = nodes.find(item => item.id === source);
    const { data: { linkIds }, id } = sourceNode!;
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data: [{
        recordId: id,
        fieldId: linkFieldId,
        value: linkIds.filter(item => item !== target),
      }],
    });
  };

  return (
    <>
      <path
        id={id}
        stroke={colors.errorColor}
        fill='none'
        strokeWidth={2}
        strokeDasharray={8}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2 + 88}
        y={edgeCenterY - foreignObjectSize / 2}
      >
        <body style={{ backgroundColor: 'inherit', position: 'fixed' }}>
          <div
            className={styles.foreignObject}
          >
            <Tooltip
              title={t(Strings.org_chart_cycle_button_tip)}
            >
              <IconButton
                icon={DeleteOutlined}
                onClick={handleDelete}
                size='small'
                style={{
                  backgroundColor: colors.defaultBg,
                }}
                className={styles.deleteButton}
              />         
            </Tooltip>
          </div>
          
        </body>
      </foreignObject>
    </>
  );
};
