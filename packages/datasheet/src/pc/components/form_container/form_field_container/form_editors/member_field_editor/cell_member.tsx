import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { IUnitIds, MemberField, IUnitMap, IUserMap, Selectors, Api, StoreActions } from '@vikadata/core';
import styles from './style.module.less';
import optionalStyle from 'pc/components/multi_grid/cell/optional_cell_container/style.module.less';
import { useThemeColors } from '@vikadata/components';
import { stopPropagation } from 'pc/utils';
import { ButtonPlus } from 'pc/components/common';
import { MouseDownType } from 'pc/components/selection_wrapper';
import { ICellComponentProps } from 'pc/components/multi_grid/cell/cell_value/interface';
import { OptionalCellContainer } from 'pc/components/multi_grid/cell/optional_cell_container/optional_cell_container';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import IconClose from 'static/icon/datasheet/datasheet_icon_exit.svg';
import { difference, keyBy } from 'lodash';
import { store } from 'pc/store';

interface ICellMemberProps {
  keyPrefix?: string;
  unitMap: IUnitMap | IUserMap | null;
  style?: React.CSSProperties;
  deletable?: boolean;
}

export const CellMember: React.FC<ICellComponentProps & ICellMemberProps> = props => {
  const {
    cellValue: cellValueIncludeOldData, 
    field, 
    unitMap,
    isActive, 
    onChange, 
    toggleEdit, 
    readonly, 
    className,
    deletable = true,
    style,
  } = props;
  const colors = useThemeColors();
  const isMulti = field.property.isMulti;
  const cellValue = useMemo(() => {
    return MemberField.polyfillOldData((cellValueIncludeOldData as IUnitIds)?.flat());
  }, [cellValueIncludeOldData]);

  useEffect(() => {
    // 处理数据协同导致的成员信息缺失处理
    if (!cellValue?.length) return;
    const state = store.getState();
    const unitMap = Selectors.getUnitMap(state);
    const exitUnitIds = unitMap ? Object.keys(unitMap) : [];
    const missInfoUnitIds: string[] = difference(cellValue, exitUnitIds);
    if (!missInfoUnitIds.length) return;
    const { shareId, templateId } = state.pageParams;
    const linkId = shareId || templateId;
    Api.loadOrSearch({ unitIds: missInfoUnitIds.join(','), linkId }).then(res => {
      const { data: { data: resData, success }} = res;
      if (!resData.length || !success) return;
      store.dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
    });
  }, [cellValue, field]);

  function deleteItem(e: React.MouseEvent, index?: number) {
    stopPropagation(e);
    onChange && onChange((cellValue as IUnitIds)?.filter((_, idx) => idx !== index));
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === MouseDownType.Right) return;
    isActive && !readonly && toggleEdit && toggleEdit();
  }

  const showAddIcon = (isActive && !readonly) && (isMulti || (!isMulti && (!cellValue || cellValue.length === 0)));

  const showDeleteButton = () => {
    if (!deletable) return false;
    return isActive && !readonly;
  };

  return (
    <OptionalCellContainer
      onMouseDown={onMouseDown}
      className={className}
      style={style}
      displayMinWidth={Boolean(isActive && !readonly && isMulti)}
    >
      {
        showAddIcon &&
        <ButtonPlus.Icon
          size={'x-small'}
          className={optionalStyle.iconAdd}
          icon={<IconAdd width={14} height={14} fill={colors.fourthLevelText} />}
        />
      }
      {
        cellValue ? (cellValue as IUnitIds).map((item, index) => {
          if (!unitMap || !unitMap[item]) return <></>;
          return (
            <MemberItem unitInfo={unitMap[item]} key={index}>
              {
                showDeleteButton() ? 
                  <div
                    className={styles.iconDelete}
                    onClick={e => deleteItem(e, index)}
                    onMouseDown={stopPropagation}
                  >
                    <IconClose width={8} height={8} fill={colors.secondLevelText} />
                  </div> : <></>
              }
            </MemberItem>
          );
        }) : <></>
      }
    </OptionalCellContainer>
  );
};
