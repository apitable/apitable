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

import classNames from 'classnames';
import keyBy from 'lodash/keyBy';
import { useEffect, useMemo, useState, Fragment } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import {
  DatasheetApi,
  integrateCdnHost,
  IUuids,
  MemberType,
  OtherTypeUnitId,
  RowHeightLevel,
  Selectors,
  Settings,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { MemberItem } from '../cell_member/member_item';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import styles from './style.module.less';

export interface ICellCreatedByProps extends ICellComponentProps {
  keyPrefix?: string;
  isFromExpand?: boolean;
  rowHeightLevel?: RowHeightLevel;
}

export const CellCreatedBy: React.FC<React.PropsWithChildren<ICellCreatedByProps>> = (props) => {
  const { field: currentField, isFromExpand, className, readonly, cellValue, rowHeightLevel } = props;
  const { userMap, userInfo: userData } = useAppSelector(
    (state) => ({
      userMap: Selectors.getUserMap(state),
      userInfo: state.user.info!,
    }),
    shallowEqual,
  );
  const [showTip, setShowTip] = useState(false);
  const cellVal = useMemo(() => {
    return cellValue == null ? [] : [cellValue].flat();
  }, [cellValue]);
  const isAlien = cellVal.includes(OtherTypeUnitId.Alien);

  useEffect(() => {
    // Handling missing User information due to data synergies
    if (!cellVal.length || isAlien) {
      return;
    }
    const userMap = Selectors.getUserMap(store.getState())!;
    const isInfoExisted = userMap && cellVal.every((userId) => Boolean(userMap[userId as string]));
    if (isInfoExisted) {
      return;
    }
    const { datasheetId, formId } = store.getState().pageParams;
    const nodeId = datasheetId || formId;
    DatasheetApi.fetchUserList(nodeId!, cellVal as string[]).then((res) => {
      const {
        data: { data: resData, success },
      } = res as any;
      if (!resData?.length || !success) {
        return;
      }
      store.dispatch(StoreActions.updateUserMap(keyBy(resData, 'userId')));
    });
  }, [cellVal, currentField, isAlien]);

  function renderUser() {
    if (!cellVal.length) {
      return <div style={{ width: '100%' }} />;
    }
    return (
      <>
        {(cellVal as IUuids).map((item, index) => {
          let userInfo;
          let key: string;

          switch (item) {
            // The "current user" flag appears when filtering only
            case OtherTypeUnitId.Self: {
              const { uuid, unitId, memberName, nickName } = userData;
              userInfo = {
                type: MemberType.Member,
                userId: uuid,
                unitId,
                avatar: '',
                name: `${t(Strings.add_sort_current_user)}（${memberName || nickName}）`,
                isActive: true,
                isDelete: false,
                isSelf: true,
              };
              key = `${OtherTypeUnitId.Self}-${unitId}`;
              break;
            }
            // CreateBy support shows anonymous
            case OtherTypeUnitId.Alien: {
              userInfo = {
                type: MemberType.Member,
                userId: OtherTypeUnitId.Alien,
                unitId: OtherTypeUnitId.Alien,
                avatar: integrateCdnHost(Settings.datasheet_unlogin_user_avatar.value),
                name: t(Strings.anonymous),
                isActive: true,
                isSelf: true,
              };
              key = `${OtherTypeUnitId.Alien}-${index}`;
              break;
            }
            default: {
              if (!userMap || !userMap[item]) {
                return <Fragment key={index} />;
              }
              // Compatible with User whose type is not found in the section
              userInfo = { ...userMap[item] };
              if (!userInfo.type) {
                userInfo.type = MemberType.Member;
                userInfo.isActive = true;
              }
              key = props.keyPrefix ? `${props.keyPrefix}-${index}` : userInfo.userId;
            }
          }
          return <MemberItem unitInfo={userInfo} key={key} />;
        })}
      </>
    );
  }

  const handleDbClick = () => {
    const state = store.getState();
    const permissions = Selectors.getPermissions(state);
    if (permissions.cellEditable) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 2000);
    }
  };
  return (
    <OptionalCellContainer
      className={classNames(styles.cellCreatedBy, className)}
      onDoubleClick={handleDbClick}
      displayMinWidth={false}
      viewRowHeight={rowHeightLevel}
    >
      {!isFromExpand && showTip && readonly ? (
        <Tooltip title={t(Strings.uneditable_check_info)} visible={showTip} placement="top" autoAdjustOverflow>
          {renderUser()}
        </Tooltip>
      ) : (
        renderUser()
      )}
    </OptionalCellContainer>
  );
};
