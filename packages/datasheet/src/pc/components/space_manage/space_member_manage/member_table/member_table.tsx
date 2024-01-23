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

import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import * as React from 'react';
import { FC, ReactText, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { lightColors, List, Pagination } from '@apitable/components';
import { ConfigConstant, IMemberInfoInSpace, IReduxState, isIdassPrivateDeployment, StoreActions, Strings, t } from '@apitable/core';
import { CheckOutlined, FilterOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Modal, Tooltip } from 'pc/components/common';
import { useMemberManage, useUpdateMemberListInSpace } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { EditMemberModal } from '../modal';
import { nameColRender, OperateCol } from '../ui';
import { isPrimaryOrOwnFunc } from '../utils';
// @ts-ignore
import { isSocialDingTalk, isSocialFeiShu, isSocialPlatformEnabled, isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

interface IMemberTable {
  searchMemberRes: IMemberInfoInSpace[];
  setSearchMemberRes: React.Dispatch<React.SetStateAction<IMemberInfoInSpace[]>>;
}

export const MemberTable: FC<React.PropsWithChildren<IMemberTable>> = (props) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [scrollHeight, setScrollHeight] = useState(0);
  const { spaceId, selectedTeamInfoInSpace, selectMemberListInSpace, memberListInSpace, selectedRows, user, spaceResource, spaceInfo } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      selectedTeamInfoInSpace: state.spaceMemberManage.selectedTeamInfoInSpace,
      selectMemberListInSpace: state.spaceMemberManage.selectMemberListInSpace,
      selectedRows: state.spaceMemberManage.selectedRows,
      memberListInSpace: state.spaceMemberManage.memberListInSpace,
      user: state.user.info,
      spaceResource: state.spacePermissionManage.spaceResource,
      spaceInfo: state.space.curSpaceInfo,
    }),
    shallowEqual,
  );
  const { updateMemberListInSpace } = useUpdateMemberListInSpace();
  const { removeMember } = useMemberManage();
  const [adjustMemberModalVisible, setAdjustMemberModalVisible] = useState(false);
  const isBindSocial = spaceInfo && isSocialPlatformEnabled?.(spaceInfo) && isSocialDingTalk?.(spaceInfo) && isSocialWecom?.(spaceInfo);
  const isRootTeam = selectedTeamInfoInSpace && selectedTeamInfoInSpace.teamId === ConfigConstant.ROOT_TEAM_ID;
  const isPrimaryOrOwn = React.useCallback((info: IMemberInfoInSpace) => user && isPrimaryOrOwnFunc(info, user.memberId), [user]);
  // Replace the selected group and initialize the form pages
  useEffect(() => {
    setPageNo(1);
    setEmptyData(false);
    setSelectEnter(true);
    setSelectOuter(true);
  }, [selectedTeamInfoInSpace?.teamId]);

  const updateScroll = React.useCallback(() => {
    if (tableRef.current) {
      const height = tableRef.current.clientHeight - 45;
      setScrollHeight(height);
    }
  }, []);

  const [selectEnter, setSelectEnter] = useState(true);
  const [selectOuter, setSelectOuter] = useState(true);
  const [isEmptyData, setEmptyData] = useState(false);

  useLayoutEffect(() => {
    updateScroll();
  });

  React.useEffect(() => {
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('resize', updateScroll);
    };
  }, [updateScroll]);

  const hideDelBtn = React.useCallback(
    (record: IMemberInfoInSpace) => {
      return (
        isSocialFeiShu?.(spaceInfo) ||
        (isRootTeam && isPrimaryOrOwn(record)) ||
        (selectedTeamInfoInSpace && selectedTeamInfoInSpace.teamId === ConfigConstant.ROOT_TEAM_ID)
      );
    },
    [isPrimaryOrOwn, isRootTeam, selectedTeamInfoInSpace, spaceInfo],
  );

  const changePageNo = (pageNo: number) => {
    const isActive = selectOuter ? (selectEnter ? undefined : '0') : '1';
    updateMemberListInSpace(selectedTeamInfoInSpace!.teamId, pageNo, isActive, selectedTeamInfoInSpace);
    setPageNo(pageNo);
  };

  const editMemberBtn = (record: IMemberInfoInSpace) => {
    setAdjustMemberModalVisible(true);
    dispatch(StoreActions.getEditMemberInfo(record.memberId));
  };
  const singleDelMemberBtn = (record: IMemberInfoInSpace) => {
    removeBaseFunc([record]);
  };
  const removeBaseFunc = (memberArr: IMemberInfoInSpace[]) => {
    const memberIdArr = memberArr.map((item) => item.memberId);
    Modal.confirm({
      title: t(Strings.kindly_reminder),
      content: t(Strings.remove_from_team_confirm_tip),
      onOk: () => removeFromTeamSelected(memberIdArr),
      type: 'danger',
    });
  };
  const removeFromTeamSelected = (memberIdArr: string[]) => {
    removeMember({
      teamId: selectedTeamInfoInSpace!.teamId,
      memberIdArr,
      isDeepDel: false,
      resFunc: () => updateSelectArr(memberIdArr),
    });
  };
  const updateSelectArr = (arr: string[]) => {
    setPageNo(1);
    if (arr.length === 1) {
      const newSelect = selectMemberListInSpace.filter((item) => item !== arr[0]);
      dispatch(StoreActions.updateSelectMemberListInSpace(newSelect));
      return;
    }
    dispatch(StoreActions.updateSelectMemberListInSpace([]));
  };

  const env = getEnvVariables();

  const columns: ColumnProps<IMemberInfoInSpace>[] = [
    {
      title: t(Strings.edit_member_name),
      dataIndex: 'memberName',
      key: 'memberName',
      align: 'center',
      render: (value, record) => nameColRender(value, record, spaceInfo, spaceId),
      filterDropdown: () => (
        <List
          data={[
            {
              title: t(Strings.joined_members),
              onClick: () => {
                setSelectEnter(!selectEnter);
                const isActive = selectOuter ? (!selectEnter ? undefined : '0') : !selectEnter ? '1' : '-1';
                if (isActive === '-1') {
                  setEmptyData(true);
                } else {
                  setEmptyData(false);
                  updateMemberListInSpace(selectedTeamInfoInSpace!.teamId, 1, isActive, selectedTeamInfoInSpace);
                  setPageNo(1);
                }
              },
              isSelected: selectEnter,
            },
            {
              title: t(Strings.not_joined_members),
              onClick: () => {
                setSelectOuter(!selectOuter);
                const isActive = selectEnter ? (!selectOuter ? undefined : '1') : !selectOuter ? '0' : '-1';
                if (isActive === '-1') {
                  setEmptyData(true);
                } else {
                  setEmptyData(false);
                  updateMemberListInSpace(selectedTeamInfoInSpace!.teamId, 1, isActive, selectedTeamInfoInSpace);
                  setPageNo(1);
                }
              },
              isSelected: selectOuter,
            },
          ]}
          renderItem={(item: any, index) => (
            <div onClick={item.onClick} className={styles.listItem} key={index}>
              {item.title}
              {item.isSelected && <CheckOutlined size={16} color={lightColors.primaryColor} />}
            </div>
          )}
        />
      ),
      filterIcon: <FilterOutlined />,
    },
    {
      title: t(Strings.team),
      dataIndex: 'teamData',
      key: 'teamData',
      align: 'center',
      render: (value) => {
        const text = value ? value.map((team: any) => team.fullHierarchyTeamName).join(' & ') : [];
        const tipsTitle = value
          ? value.map((team: any, index: number) => (
            <div key={index} className={styles.teamItem}>
              <p>-</p>
              <p>{team.fullHierarchyTeamName}</p>
            </div>
          ))
          : '';
        return (
          <Tooltip title={tipsTitle} rowsNumber={2} textEllipsis overflowWidth={200} showTipAnyway>
            <span className={styles.tipText}>{text || selectedTeamInfoInSpace!.teamTitle}</span>
          </Tooltip>
        );
      },
    },
    {
      title: t(Strings.email),
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      ellipsis: true,
    },
    {
      title: t(Strings.operate),
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      // width: isRootTeam ? 70 : 100,
      render: (_value, record) => (
        <OperateCol
          prevBtnClick={() => editMemberBtn(record)}
          hideNextBtn={Boolean(hideDelBtn(record))}
          nextBtnClick={() => singleDelMemberBtn(record)}
          disabledNextBtn={Boolean(isRootTeam)}
        />
      ),
    },
  ];

  if (env.USER_BIND_PHONE_VISIBLE) {
    columns.splice(2, 0, {
      title: t(Strings.phone_number),
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      ellipsis: true,
    });
  }

  // If privatizing the operation column for the Yufu
  if (isIdassPrivateDeployment()) {
    columns.length = columns.length - 1;
  }

  const onSelectMemberChange = (selectedRowKeys: ReactText[], selectedRows: IMemberInfoInSpace[]) => {
    dispatch(StoreActions.updateSelectMemberListInSpace(selectedRowKeys as string[]));
    dispatch(StoreActions.updateSelectedRowsInSpace(selectedRows));
  };

  const tableProps = {
    columns:
      spaceResource && spaceResource.permissions.includes(ConfigConstant.PermissionCode.MEMBER) && !isBindSocial
        ? columns
        : columns.filter((_item, index) => index !== columns.length - 1),
    dataSource: isEmptyData ? [] : props.searchMemberRes.length > 0 ? props.searchMemberRes : memberListInSpace,
    rowSelection: isBindSocial
      ? undefined
      : {
        selectedRowKeys: selectMemberListInSpace,
        selectedRows,
        onChange: onSelectMemberChange,
        columnWidth: 40,
      },
    rowKey: (record: any) => String(record.orderNo),
  };

  const showPagination = Boolean(
    selectedTeamInfoInSpace && selectedTeamInfoInSpace.memberCount && selectedTeamInfoInSpace.memberCount > ConfigConstant.MEMBER_LIST_PAGE_SIZE,
  );
  return (
    <>
      <div className={styles.memberTable} ref={tableRef}>
        <Table {...tableProps} pagination={false} rowKey={(record) => String(record.memberId)} scroll={{ y: scrollHeight }} />
      </div>
      {showPagination && (
        <Pagination
          current={pageNo}
          total={selectedTeamInfoInSpace?.memberCount || 0}
          pageSize={ConfigConstant.MEMBER_LIST_PAGE_SIZE}
          onChange={changePageNo}
          className={styles.pagination}
        />
      )}
      {adjustMemberModalVisible && (
        <EditMemberModal
          cancelModalVisible={() => {
            setAdjustMemberModalVisible(false);
          }}
          removeCallback={() => {
            setPageNo(1);
            props.setSearchMemberRes([]);
          }}
          pageNo={pageNo}
        />
      )}
    </>
  );
};
