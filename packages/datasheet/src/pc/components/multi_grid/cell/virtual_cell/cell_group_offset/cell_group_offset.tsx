import { CellType, ILinearRow, ILinearRowBlank } from '@apitable/core';
import { GROUP_OFFSET } from 'pc/components/multi_grid/grid_views';
import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import { useIsRecordWillMove } from '../../hooks';
import { useIsGroupCollapsing } from '../../hooks/use_is_group_collapsing';
import { GRAY_COLOR_BORDER, groupColor } from '../cell_group_tab/cell_group_tab';
import { getGroupColor } from '../utils';

interface ICellGroupOffset {
  groupLength: number;
  columnsLength: number;
  actualColumnIndex: number;
  isEmptyRows: boolean;
  style: React.CSSProperties;
  isGroupTab?: boolean;
  path?: number[];
  row: ILinearRow;
  nextRow: ILinearRow;
  needOffsetBorderBottom?: boolean;
}

/**
 * 
 * 处理好分组情况下，首列和尾列的 border 边界
 */
export const CellGroupOffset: React.FC<ICellGroupOffset> = React.memo(({
  children, groupLength, actualColumnIndex, style, row, columnsLength, needOffsetBorderBottom, nextRow,
}) => {
  const colors = useThemeColors();
  const isRecordWillMove = useIsRecordWillMove(row.recordId);
  const isCollapsing = useIsGroupCollapsing(row);
  if (!groupLength) {
    return <>{children}</>;
  }

  const isDepth0BlankRow = row.type === CellType.Blank && row.depth === 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {
        !isDepth0BlankRow && actualColumnIndex === 0 && new Array(groupLength - 1).fill('').map((item, index) => {
          const hasBorderLeft = () => {
            if (row.type === CellType.Blank) {
              return row.depth > index;
            }
            return actualColumnIndex === 0;
          };
          const hasBorderBottom = () => {
            return needOffsetBorderBottom &&
              [...Array(groupLength - 1).keys()].slice((row as ILinearRowBlank).depth - 1).includes(index);
          };
          const getBackgroundColor = () => {
            if (isRecordWillMove && row.type === CellType.Record) return 'rgba(250, 173, 20, 0.2)';
            const colorIndex = hasBorderLeft() ? index : 0;
            return getGroupColor(groupLength)(colorIndex);
          };
          return (
            <div
              key={index}
              style={{
                ...style,
                width: GROUP_OFFSET,
                overflow: 'hidden',
                marginLeft: actualColumnIndex === 0 ? index * GROUP_OFFSET : '',
                borderLeft: hasBorderLeft() ? GRAY_COLOR_BORDER : '',
                borderBottom: hasBorderBottom() ? GRAY_COLOR_BORDER : '',
                borderRight: columnsLength > 1 &&
                  actualColumnIndex === columnsLength - 1 ? GRAY_COLOR_BORDER : '',
                boxShadow: index === groupLength ? '0px 1px 0px 0px  inset' + colors.sheetLineColor : '',
                borderBottomLeftRadius: actualColumnIndex === 0 ? '2px' : '',
                background: getBackgroundColor(),
              }}
              className={groupColor(groupLength)[index]}
            />
          );
        })
      }
      {children}
      {
        !isDepth0BlankRow && columnsLength > 1 && actualColumnIndex === columnsLength - 1 &&
        groupLength - 2 > -1 && new Array(groupLength - 2).fill('').map((item, index) => {
          const hasBorderRight = () => {
            if (row.type === CellType.Blank) {
              // 不是通项写法。
              return row.depth === 2;
            }
            if (row.type === CellType.GroupTab) {
              return groupLength - row.depth - 2 <= index;
            }
            return actualColumnIndex === columnsLength - 1;
          };
          const hasBorderBottom = () => {
            const isNextRowBlank = (nextRow && nextRow.type === CellType.Blank) || !nextRow;
            return needOffsetBorderBottom || (isCollapsing && isNextRowBlank && row.depth < 2);
          };
          const hasBorderTop = () => row.type === CellType.GroupTab && row.depth < 2;

          const getBackgroundColor = () => {
            const colorIndex = hasBorderRight() ? 1 : 0;
            return getGroupColor(groupLength)(colorIndex);
          };
          return (<div
            key={index}
            style={{
              ...style,
              width: GROUP_OFFSET,
              left: parseInt(style.width as string, 10) + parseInt(style.left as string, 10) - GROUP_OFFSET,
              overflow: 'hidden',
              borderTop: hasBorderTop() ? GRAY_COLOR_BORDER : '',
              borderBottom: hasBorderBottom() ? GRAY_COLOR_BORDER : '',
              borderRight: hasBorderRight() ? GRAY_COLOR_BORDER : '',
              borderBottomLeftRadius: actualColumnIndex === 0 ? '2px' : '',
              background: getBackgroundColor(),
            }}
            className={row.type !== CellType.GroupTab ? groupColor(groupLength)[1] : ''}
          />);
        })
      }
    </div>
  );
});
