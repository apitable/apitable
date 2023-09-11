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

import { Tooltip } from 'antd';
import { FC, useContext } from 'react';
import { IconButton, useThemeColors } from '@apitable/components';
import { CollaCommandName, Strings, t } from '@apitable/core';
import { DeleteOutlined } from '@apitable/icons';
import { EdgeProps, getEdgeCenter, getMarkerEnd, useStoreState } from '@apitable/react-flow';
import { resourceService } from 'pc/resource_service';
import { FlowContext } from '../../context/flow_context';
import styles from './styles.module.less';

const foreignObjectSize = 40;

export const CustomCycleEdge: FC<React.PropsWithChildren<EdgeProps>> = ({
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

  const {
    datasheetId,
    orgChartStyle: { linkFieldId },
  } = useContext(FlowContext);

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const nodes = useStoreState((state) => state.nodes);

  const handleDelete = () => {
    const sourceNode = nodes.find((item) => item.id === source);
    const {
      data: { linkIds },
      id,
    } = sourceNode!;
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data: [
        {
          recordId: id,
          fieldId: linkFieldId,
          value: linkIds.filter((item: string) => item !== target),
        },
      ],
    });
  };

  return (
    <>
      <path id={id} stroke={colors.errorColor} fill="none" strokeWidth={2} strokeDasharray={8} d={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2 + 88}
        y={edgeCenterY - foreignObjectSize / 2}
      >
        <body style={{ backgroundColor: 'inherit', position: 'fixed' }}>
          <div className={styles.foreignObject}>
            <Tooltip title={t(Strings.org_chart_cycle_button_tip)}>
              <IconButton
                icon={DeleteOutlined}
                onClick={handleDelete}
                size="small"
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
