import {
  DatasheetApi, integrateCdnHost, IUuids, MemberType, OtherTypeUnitId, RowHeightLevel, Selectors, Settings, StoreActions, Strings, t
} from '@vikadata/core';
import { store } from 'pc/store';
import classNames from 'classnames';
import keyBy from 'lodash/keyBy';
import { useEffect, useMemo, useState, Fragment } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { MemberItem } from '../cell_member/member_item';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import styles from './style.module.less';
import { Tooltip } from 'pc/components/common';

export interface ICellCreatedByProps extends ICellComponentProps {
  keyPrefix?: string;
  isFromExpand?: boolean;
  rowHeightLevel?: RowHeightLevel;
}

export const CellCreatedBy: React.FC<ICellCreatedByProps> = props => {
  const { field: currentField, isFromExpand, className, readonly, cellValue, rowHeightLevel } = props;
  const { userMap, userInfo: userData } = useSelector(state => ({
    userMap: Selectors.getUserMap(state),
    userInfo: state.user.info!,
  }), shallowEqual);
  const [showTip, setShowTip] = useState(false);
  const cellVal = useMemo(() => {
    return cellValue == null ? [] : [cellValue].flat();
  }, [cellValue]);
  const isAlien = cellVal.includes(OtherTypeUnitId.Alien);

  useEffect(() => {
    // 处理数据协同导致的 User 信息缺失情况
    if (!cellVal.length || isAlien) {
      return;
    }
    const userMap = Selectors.getUserMap(store.getState())!;
    const isInfoExisted = userMap && cellVal.every(userId => Boolean(userMap[userId as string]));
    if (isInfoExisted) {
      return;
    }
    const { datasheetId, formId } = store.getState().pageParams;
    const nodeId = datasheetId || formId;
    DatasheetApi.fetchUserList(nodeId!, cellVal as string[]).then(res => {
      const { data: { data: resData, success }} = res as any;
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
        {
          (cellVal as IUuids).map((item, index) => {
            let userInfo;
            let key: string;

            switch (item) {
              // 仅筛选时会出现 -> “当前用户” 标记
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
                // 防止 key 重复
                key = `${OtherTypeUnitId.Self}-${unitId}`;
                break;
              }
              // 创建人支持显示匿名者
              case OtherTypeUnitId.Alien: {
                userInfo = {
                  type: MemberType.Member,
                  userId: OtherTypeUnitId.Alien,
                  unitId: OtherTypeUnitId.Alien,
                  avatar: integrateCdnHost(Settings.anonymous_avatar.value),
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
                // 兼容部分查不到 type 的 User
                userInfo = { ...userMap[item] };
                if (!userInfo.type) {
                  userInfo.type = MemberType.Member;
                  userInfo.isActive = true;
                }
                key = props.keyPrefix ? `${props.keyPrefix}-${index}` : userInfo.userId;
              }
            }
            return (
              <MemberItem unitInfo={userInfo} key={key} />
            );
          })
        }
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
      {
        (!isFromExpand && showTip && readonly) ? (
          <Tooltip
            title={t(Strings.uneditable_check_info)}
            visible={showTip}
            placement="top"
            autoAdjustOverflow
          >
            {renderUser()}
          </Tooltip>
        ) : renderUser()
      }
    </OptionalCellContainer>
  );
};
