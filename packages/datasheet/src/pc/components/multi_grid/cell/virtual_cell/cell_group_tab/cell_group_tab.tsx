import { IGroupInfo, ILinearRowGroupTab } from '@apitable/core';
import classNames from 'classnames';
import { GROUP_OFFSET } from 'pc/components/multi_grid/grid_views';
// FIXME:THEME
import { colorVars } from '@apitable/components';
import { GROUP_TITLE } from 'pc/utils';
import * as React from 'react';
import { useShowKeepSortBorder } from '../../hooks';
import { useIsGroupCollapsing } from '../../hooks/use_is_group_collapsing';
import styles from '../../styles.module.less';
import { GroupTab } from './group_tab/group_tab';
import { GROUP_HEIGHT } from './constant';

export function groupColor(level: number) {
  if (level === 1) {
    return [colorVars.defaultBg];
  }
  if (level === 2) {
    return [styles.groupBg40, colorVars.defaultBg];
  }
  return [styles.groupBg80, styles.groupBg40, styles.groupBg];
}

interface ICellGroupTab {
  actualColumnIndex: number;
  columnsLength: number;
  row: ILinearRowGroupTab;
  style: React.CSSProperties;
  groupInfo: IGroupInfo;
  isSort?: boolean;
}

export const GRAY_COLOR_BORDER = ' 1px solid ' + colorVars.sheetLineColor;
export const PRIMARY_COLOR_BORDER = ' 1px solid ' + colorVars.primaryColor;

export const CellGroupTab: React.FC<ICellGroupTab> = React.memo(props => {
  const { actualColumnIndex, row, style, columnsLength, groupInfo, isSort } = props;
  // const groupingCollapseMap = useSelector(state => Selectors.getGroupingCollapseMap(state));
  let width = parseInt(style.width as string, 10);
  if (actualColumnIndex === 0) {
    width = width + groupInfo.length * GROUP_OFFSET;
  }

  const pathLength = row.depth + 1;

  const height = GROUP_HEIGHT;
  const isEndGroupHead = groupInfo.length === pathLength;
  const _showKeepSortBorder = useShowKeepSortBorder(row.recordId);
  const showKeepSortBorder = isEndGroupHead && _showKeepSortBorder;
  const isCollapsing = useIsGroupCollapsing(row);

  function reviseWidth(width: number) {
    if (actualColumnIndex === 0 && groupInfo) {
      width = width - pathLength * GROUP_OFFSET;
    }
    if (columnsLength > 1 && actualColumnIndex === columnsLength - 1 && groupInfo.length === 3) {
      width = width - GROUP_OFFSET;
    }
    return width;
  }

  function getMainStyle() {
    function getBorderRight() {
      if (showKeepSortBorder && actualColumnIndex === columnsLength - 1) {
        return PRIMARY_COLOR_BORDER;
      }
      if (actualColumnIndex === 0) {
        return GRAY_COLOR_BORDER;
      }
      if (groupInfo.length !== 1 && pathLength === groupInfo.length && actualColumnIndex === columnsLength - 1) {
        return GRAY_COLOR_BORDER;
      }
      return '';
    }

    function getBorderLeft() {
      if (actualColumnIndex === 0) {
        return showKeepSortBorder ? PRIMARY_COLOR_BORDER : GRAY_COLOR_BORDER;
      }
      return '';
    }

    function getBorderBottom() {
      if (isCollapsing) {
        return showKeepSortBorder ? PRIMARY_COLOR_BORDER : 'none';
      }

      if (groupInfo.length === pathLength) {
        return GRAY_COLOR_BORDER;
      }

      return 'none';
    }

    return {
      borderLeft: getBorderLeft(),
      borderTop: showKeepSortBorder ? PRIMARY_COLOR_BORDER : GRAY_COLOR_BORDER,
      borderRight: getBorderRight(),
      borderBottom: getBorderBottom(),
      borderRadius: pathLength !== 1 ? '0px' : '',
      marginLeft: actualColumnIndex === 0 ? (pathLength - 1) * GROUP_OFFSET : '',
      boxShadow: isCollapsing ? '0px -2px 0px -1px rgb(225, 226, 233) inset' : '',
    };
  }

  return (
    <div
      style={{
        ...style,
        height,
        width: reviseWidth(width),
        ...getMainStyle(),
      }}
      className={classNames(
        actualColumnIndex === 0 ? styles['groupLevel' + pathLength] : styles.groupBase,
        groupColor(groupInfo.length)[pathLength - 1],
      )}
    >
      <div
        style={{
          marginLeft: actualColumnIndex === 0 && pathLength === 1 ? '0px' : '',
          width: '100%',
          height: GROUP_HEIGHT,
        }}
        className={classNames(styles.groupTitle, GROUP_TITLE, actualColumnIndex === 0 ? styles.groupTitleLeft : '')}
        data-group-head-record-id={isEndGroupHead ? row.recordId : ''}
      >
        <GroupTab actualColumnIndex={actualColumnIndex} row={row} groupInfo={groupInfo} isSort={isSort} />
      </div>
    </div>
  );
});
