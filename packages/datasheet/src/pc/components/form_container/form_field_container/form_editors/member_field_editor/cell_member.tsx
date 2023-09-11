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

import { difference, keyBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IUnitIds, MemberField, IUnitMap, IUserMap, Selectors, Api, StoreActions } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { ButtonPlus } from 'pc/components/common';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { ICellComponentProps } from 'pc/components/multi_grid/cell/cell_value/interface';
import { OptionalCellContainer } from 'pc/components/multi_grid/cell/optional_cell_container/optional_cell_container';
import optionalStyle from 'pc/components/multi_grid/cell/optional_cell_container/style.module.less';
import { store } from 'pc/store';
import { stopPropagation } from 'pc/utils';
import { MouseDownType } from '../../../../multi_grid';
import styles from './style.module.less';

interface ICellMemberProps {
  keyPrefix?: string;
  unitMap: IUnitMap | IUserMap | null;
  style?: React.CSSProperties;
  deletable?: boolean;
}

export const CellMember: React.FC<React.PropsWithChildren<ICellComponentProps & ICellMemberProps>> = (props) => {
  const { cellValue: cellValueIncludeOldData, field, unitMap, isActive, onChange, toggleEdit, readonly, className, deletable = true, style } = props;
  const colors = useThemeColors();
  const isMulti = field.property.isMulti;
  const cellValue = useMemo(() => {
    return MemberField.polyfillOldData((cellValueIncludeOldData as IUnitIds)?.flat());
  }, [cellValueIncludeOldData]);

  useEffect(() => {
    // Dealing with missing member information due to data synergies
    if (!cellValue?.length) return;
    const state = store.getState();
    const unitMap = Selectors.getUnitMap(state);
    const exitUnitIds = unitMap ? Object.keys(unitMap) : [];
    const missInfoUnitIds: string[] = difference(cellValue, exitUnitIds);
    if (!missInfoUnitIds.length) return;
    const { shareId, templateId } = state.pageParams;
    const linkId = shareId || templateId;
    Api.loadOrSearch({ unitIds: missInfoUnitIds.join(','), linkId }).then((res) => {
      const {
        data: { data: resData, success },
      } = res;
      if (!resData.length || !success) return;
      store.dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
    });
  }, [cellValue, field]);

  function deleteItem(e: React.MouseEvent, index?: number) {
    stopPropagation(e);
    onChange && onChange((cellValue as IUnitIds)?.filter((_, idx) => idx !== index));
  }

  async function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === MouseDownType.Right) return;
    isActive && !readonly && toggleEdit && (await toggleEdit());
  }

  const showAddIcon = isActive && !readonly && (isMulti || (!isMulti && (!cellValue || cellValue.length === 0)));

  const showDeleteButton = () => {
    if (!deletable) return false;
    return isActive && !readonly;
  };

  return (
    <OptionalCellContainer onMouseDown={onMouseDown} className={className} style={style} displayMinWidth={Boolean(isActive && !readonly && isMulti)}>
      {showAddIcon && (
        <ButtonPlus.Icon size={'x-small'} className={optionalStyle.iconAdd} icon={<AddOutlined size={14} color={colors.fourthLevelText} />} />
      )}
      {cellValue ? (
        (cellValue as IUnitIds).map((item, index) => {
          if (!unitMap || !unitMap[item]) return <></>;
          return (
            <MemberItem unitInfo={unitMap[item]} key={index}>
              {showDeleteButton() ? (
                <div className={styles.iconDelete} onClick={(e) => deleteItem(e, index)} onMouseDown={stopPropagation}>
                  <CloseOutlined size={8} color={colors.secondLevelText} />
                </div>
              ) : (
                <></>
              )}
            </MemberItem>
          );
        })
      ) : (
        <></>
      )}
    </OptionalCellContainer>
  );
};
