import { FC, useContext } from 'react';
import { Select } from '@vikadata/components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateUnitType, IGanttViewStatus, Selectors, StoreActions, Strings, t } from '@vikadata/core';
import { GanttOpenupOutlined, GanttPackupOutlined } from '@vikadata/icons';
import { ButtonPlus } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import styles from './style.module.less';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { isMobile as isTouchDevice } from 'react-device-detect';
import { ScreenSize } from 'pc/components/common/component_display';
import { getStyleConfig } from 'pc/common/style_config';
import { KonvaGridContext } from 'pc/components/konva_grid';

interface IDomGanttBaseProps {
  containerWidth: number;
  containerHeight: number;
  gridWidth: number;
  gridVisible: boolean;
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

export const DomGantt: FC<IDomGanttBaseProps> = props => {
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { containerWidth, gridWidth, gridVisible } = props;
  const { datasheetId, viewId } = useSelector(state => state.pageParams);
  const spaceId = useSelector(state => state.space.activeId);
  const { ganttViewStatus } = useSelector(state => {
    return {
      ganttViewStatus: Selectors.getGanttViewStatus(state)!,
    };
  }, shallowEqual);
  const { dateUnitType } = ganttViewStatus;
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

  const onSelected = option => {
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
            renderValue={option => (isMobile || isTouchDevice ? option.label : t(Strings.gantt_by_unit_type, { unitType: option.label }))}
          />
        )}
        {!isMobile && (
          <div className={styles.toggleBtnWrapper} style={{ left: gridVisible ? gridWidth - 11 : -11 }}>
            <ButtonPlus.Icon
              icon={gridVisible ? <GanttPackupOutlined color={colors.thirdLevelText} /> : <GanttOpenupOutlined color={colors.thirdLevelText} />}
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
