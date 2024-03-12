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

import { difference } from 'lodash';
import keyBy from 'lodash/keyBy';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, useThemeColors } from '@apitable/components';
import {
  Api,
  IMemberField,
  IReduxState,
  IUnitIds,
  IUnitValue,
  IUserValue,
  MemberField,
  MemberType,
  OtherTypeUnitId,
  RowHeightLevel,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { ButtonPlus } from 'pc/components/common';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { MouseDownType } from '../../enum';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import optionalStyle from '../optional_cell_container/style.module.less';
import { MemberItem } from './member_item';
import styles from './styles.module.less';

interface ICellMember extends ICellComponentProps {
  field: IMemberField;
  keyPrefix?: string;
  rowHeightLevel?: RowHeightLevel;
  deletable?: boolean;
}

export const CellMember: React.FC<React.PropsWithChildren<ICellMember>> = (props) => {
  const {
    cellValue: cellValueIncludeOldData,
    field: propsField,
    isActive,
    onChange,
    toggleEdit,
    readonly,
    className,
    rowHeightLevel,
    deletable = true,
  } = props;
  const colors = useThemeColors();
  const { datasheetId, unitMap, userInfo, field } = useAppSelector(
    (state: IReduxState) => ({
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      unitMap: Selectors.getUnitMap(state)!,
      userInfo: state.user.info!,
      field: propsField && Selectors.findRealField(state, propsField),
    }),
    shallowEqual,
  );
  const isMulti = field?.property.isMulti;
  const cellValue = useMemo(() => {
    const unitIds = MemberField.polyfillOldData(cellValueIncludeOldData as IUnitIds);
    return Array.isArray(unitIds) ? unitIds.flat() : null;
  }, [cellValueIncludeOldData]);

  useEffect(() => {
    // Handling of missing member information due to data synergy
    if (!cellValue) {
      return;
    }
    const unitMap = Selectors.getUnitMap(store.getState());
    const exitUnitIds = unitMap ? Object.keys(unitMap) : [];
    const unitIds = MemberField.polyfillOldData(cellValue as IUnitIds);
    const missInfoUnitIds: string[] = difference(unitIds, exitUnitIds);
    const realMissUnitIds = missInfoUnitIds.filter((unitId) => {
      return !([OtherTypeUnitId.Self, OtherTypeUnitId.Alien] as string[]).includes(unitId);
    });
    if (!realMissUnitIds.length) {
      return;
    }
    const { shareId, templateId } = store.getState().pageParams;
    const linkId = shareId || templateId;
    Api.loadOrSearch({ unitIds: realMissUnitIds.join(','), linkId }).then((res) => {
      const {
        data: { data: resData, success },
      } = res;
      if (!resData.length || !success) {
        return;
      }
      store.dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
    });
  }, [cellValue, field, datasheetId]);

  function deleteItem(e: React.MouseEvent, index?: number) {
    stopPropagation(e);
    onChange && onChange(cellValue && (cellValue as IUnitIds).filter((_cv, idx) => idx !== index));
  }

  async function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === MouseDownType.Right) {
      return;
    }
    isActive && !readonly && toggleEdit && (await toggleEdit());
  }

  const showAddIcon = isActive && !readonly && (isMulti || (!isMulti && !cellValue));

  const showDeleteIcon = () => {
    if (!deletable) return false;
    return isActive && !readonly;
  };

  const MainLayout = () => {
    return (
      <OptionalCellContainer
        onMouseDown={onMouseDown}
        className={className}
        displayMinWidth={Boolean(isActive && !readonly && isMulti)}
        viewRowHeight={rowHeightLevel}
      >
        {showAddIcon && <ButtonPlus.Icon size={'x-small'} className={optionalStyle.iconAdd} icon={<AddOutlined color={colors.fourthLevelText} />} />}
        {cellValue ? (
          (cellValue as IUnitIds).map((item, index) => {
            let unitInfo: IUnitValue | IUserValue;

            // The current user flag appears when filtering only
            if (item === OtherTypeUnitId.Self) {
              const { uuid, unitId } = userInfo;
              unitInfo = {
                type: MemberType.Member,
                userId: uuid,
                unitId,
                avatar: '',
                name: `${t(Strings.add_sort_current_user)}（${t(Strings.add_sort_current_user_tips)}）`,
                isActive: true,
                isDeleted: false,
                isSelf: true,
              };
            } else {
              if (!unitMap || !unitMap[item]) {
                return <></>;
              }
              unitInfo = unitMap[item];
            }
            return (
              <MemberItem unitInfo={unitInfo} key={index}>
                {showDeleteIcon() ? (
                  <Button
                    onClick={(e) => deleteItem(e, index)}
                    onMouseDown={stopPropagation}
                    className={styles.close}
                    style={{
                      width: 16,
                      height: 16,
                      padding: 0,
                      borderRadius: 2,
                      marginLeft: 4,
                    }}
                    variant="fill"
                    color={colors.defaultTag}
                  >
                    <CloseOutlined size={12} color={colors.fc2} />
                  </Button>
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

  return MainLayout();
};
