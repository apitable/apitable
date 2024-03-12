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

import { FC, useContext } from 'react';
import { isMobile as isTouchDevice } from 'react-device-detect';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-restricted-imports
import { Select } from '@apitable/components';
import { DateUnitType, IGanttViewStatus, StoreActions, Strings, t } from '@apitable/core';
import { Collapse3OpenOutlined, Collapse3Outlined } from '@apitable/icons';
import { getStyleConfig } from 'pc/common/style_config';
import { ButtonPlus } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import styles from './style.module.less';

interface IDomGanttBaseProps {
  containerWidth: number;
  containerHeight: number;
  gridWidth: number;
  gridVisible: boolean;
  dateUnitType: DateUnitType;
}

const unitOptions = [
  {
    label: t(Strings.gantt_week),
    value: DateUnitType.Week,
  },
  {
    label: t(Strings.gantt_month),
    value: DateUnitType.Month,
  },
  {
    label: t(Strings.gantt_quarter),
    value: DateUnitType.Quarter,
  },
  {
    label: t(Strings.gantt_year),
    value: DateUnitType.Year,
  },
];

export const DomGantt: FC<React.PropsWithChildren<IDomGanttBaseProps>> = (props) => {
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { containerWidth, gridWidth, gridVisible, dateUnitType } = props;
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const unitTypeSelectWidth = isMobile || isTouchDevice ? getStyleConfig('gantt_mobile_unit_select_width') : 90;

  const onGanttStatusChange = (key: string, value: any) => {
    const ganttStatusMap = getStorage(StorageName.GanttStatusMap);
    const ganttStatus = ganttStatusMap?.[`${spaceId}_${datasheetId}_${viewId}`] || ({} as IGanttViewStatus);
    setStorage(StorageName.GanttStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...ganttStatus,
        [key]: value,
      },
    });
  };

  const onSelected = (option: { value: any }) => {
    const dateUnitType = option.value;
    onGanttStatusChange('dateUnitType', option.value);
    dispatch(StoreActions.setGanttDateUnitType(dateUnitType, datasheetId!));
  };

  const onToggleBtnClick = () => {
    const visible = !gridVisible;
    onGanttStatusChange('gridVisible', visible);
    dispatch(StoreActions.toggleGanttGrid(visible, datasheetId!));
  };

  return (
    <div className={styles.domGantt}>
      <div style={{ pointerEvents: 'auto' }}>
        {containerWidth - gridWidth > 0 && (
          <Select
            options={unitOptions}
            value={dateUnitType}
            onSelected={onSelected}
            dropdownMatchSelectWidth
            triggerCls={styles.unitSelect}
            triggerStyle={{
              left: containerWidth - unitTypeSelectWidth,
              width: unitTypeSelectWidth,
              transition: 'none',
            }}
            listStyle={{
              textAlign: 'center',
            }}
            renderValue={(option) => (isMobile || isTouchDevice ? option.label : t(Strings.gantt_by_unit_type, { unitType: option.label }))}
          />
        )}
        {!isMobile && (
          <div className={styles.toggleBtnWrapper} style={{ left: gridVisible ? gridWidth - 11 : -11 }}>
            <ButtonPlus.Icon
              icon={gridVisible ? <Collapse3Outlined color={colors.thirdLevelText} /> : <Collapse3OpenOutlined color={colors.thirdLevelText} />}
              size="x-small"
              className={styles.toggleBtn}
              onClick={onToggleBtnClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};
