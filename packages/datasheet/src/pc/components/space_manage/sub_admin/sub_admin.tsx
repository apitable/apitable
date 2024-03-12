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

import { useMount } from 'ahooks';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallowEqual } from 'react-redux';
import { Button, TextButton, Typography, useThemeColors, Pagination } from '@apitable/components';
import { ConfigConstant, Events, IReduxState, ISubAdminList, Player, StoreActions, Strings, t } from '@apitable/core';
import { InfoCard, Modal } from 'pc/components/common';
import { useNotificationCreate } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { AddAdminModal, ModalType } from './add_admin_modal';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

// Some permissions that are no longer used, but because the old space will still return the corresponding data,
// the front-end to do the filtering of these permissions
const UNUSED_PERMISSION = ['MANAGE_NORMAL_MEMBER'];

const triggerBase = {
  action: ['hover'],
  popupAlign: {
    points: ['tl', 'bl'],
    offset: [0, 18],
    overflow: { adjustX: true, adjustY: true },
  },
};

export const SubAdmin: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const { subAdminList, subAdminListData, user, subscription, spaceInfo } = useAppSelector(
    (state: IReduxState) => ({
      subAdminList: state.spacePermissionManage.subAdminListData ? state.spacePermissionManage.subAdminListData.records : [],
      subAdminListData: state.spacePermissionManage.subAdminListData,
      user: state.user.info,
      subscription: state.billing?.subscription,
      spaceInfo: state.space.curSpaceInfo,
    }),
    shallowEqual,
  );
  const [modalType, setModalType] = useState<string | null>(null);
  const [editOrReadSubMainInfo, setEditOrReadSubMainInfo] = useState<ISubAdminList | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const { delSubAdminAndNotice } = useNotificationCreate({ fromUserId: user!.uuid, spaceId: user!.spaceId });

  useMount(() => {
    Player.doTrigger(Events.space_setting_sub_admin_shown);
  });
  useEffect(() => {
    dispatch(StoreActions.getSubAdminList(pageNo));
  }, [dispatch, pageNo]);

  const getPermissionContent = (arr: Array<string>) => {
    const i18nStrings = arr
      .filter((item) => {
        return !UNUSED_PERMISSION.includes(item);
      })
      .map((item) => {
        return t(Strings[`role_permission_${item.toLowerCase()}`]);
      });
    return i18nStrings.join(' & ');
  };
  const addAdminBtnClick = () => {
    const result = triggerUsageAlert?.('maxAdminNums', { usage: subAdminList.length, alwaysAlert: true }, SubscribeUsageTipType?.Alert);
    if (result) return;
    setModalType(ModalType.Add);
  };
  const editBtnClick = (record: ISubAdminList) => {
    setModalType(ModalType.Edit);
    setEditOrReadSubMainInfo(record);
  };
  const delBtnClick = (info: ISubAdminList) => {
    const title =
      getSocialWecomUnitName?.({
        name: info.memberName,
        isModified: info.isMemberNameModified,
        spaceInfo,
      }) || info.memberName;
    const isTitleStr = typeof title === 'string';
    let content: string | JSX.Element;
    if (isTitleStr) {
      content = t(Strings.space_manage_confirm_del_sub_admin_content, {
        memberName: info.memberName,
      });
    } else {
      const _content = t(Strings.space_manage_confirm_del_sub_admin_content, {
        memberName: ReactDOMServer.renderToStaticMarkup(title as JSX.Element),
      });
      content = <span dangerouslySetInnerHTML={{ __html: _content }} />;
    }
    Modal.confirm({
      title: t(Strings.space_manage_confirm_del_sub_admin_title),
      content,
      onOk: () => {
        delSubAdminAndNotice(info.memberId);
      },
      type: 'danger',
    });
  };
  const cancelModal = () => {
    setModalType(null);
    setEditOrReadSubMainInfo(null);
  };
  const columns: ColumnProps<ISubAdminList>[] = [
    {
      title: t(Strings.member_family_name),
      dataIndex: 'memberName',
      key: 'memberName',
      render: (_value, record) => {
        const title =
          getSocialWecomUnitName?.({
            name: record?.memberName,
            isModified: record?.isMemberNameModified,
            spaceInfo,
          }) || record?.memberName;
        return (
          <InfoCard
            title={title || record.memberName || t(Strings.unnamed)}
            description={record.team}
            triggerBase={triggerBase}
            key={record.id}
            memberId={record.memberId}
            avatarProps={{
              id: record.memberId,
              title: record.memberName || t(Strings.unnamed),
              src: record.avatar,
            }}
          />
        );
      },
      align: 'left',
    },
    {
      title: t(Strings.permission_bound),
      dataIndex: 'resourceGroupCodes',
      key: 'resourceGroupCodes',
      render: (value) => getPermissionContent(value),
      ellipsis: true,
      align: 'left',
    },
    {
      title: t(Strings.operate),
      dataIndex: 'operate',
      key: 'operate',
      align: 'left',
      render: (_value, record) => {
        return (
          <div className={styles.operateBtn}>
            <TextButton color="primary" onClick={() => editBtnClick(record)} size="small">
              {t(Strings.edit)}
            </TextButton>
            <span>|</span>
            <TextButton color="danger" onClick={() => delBtnClick(record)} size="small">
              {t(Strings.delete)}
            </TextButton>
          </div>
        );
      },
    },
  ];

  if (!getEnvVariables().SPACE_SUB_ADMIN_VISIBLE) {
    return <></>;
  }

  return (
    <div className={styles.subAdmin}>
      <Typography variant={'h6'}>{t(Strings.sub_admin)}</Typography>
      {subscription?.maxAdminNums && subscription.maxAdminNums > 0 && (
        <Typography variant={'body4'} color={colors.thirdLevelText} className={styles.describe}>
          {t(Strings.space_admin_info, { count: subscription.maxAdminNums })}
        </Typography>
      )}
      <div className={'vk-mt-4'}>
        <Button onClick={addAdminBtnClick} variant="jelly">
          {t(Strings.add_sub_admin)}
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table columns={columns} dataSource={subAdminList} pagination={false} rowKey={(record) => record.memberId} />
      </div>
      {subAdminListData && subAdminListData.total > ConfigConstant.SUB_ADMIN_LIST_PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            current={pageNo}
            total={subAdminListData ? subAdminListData.total : 0}
            onChange={(pageNo: number) => setPageNo(pageNo)}
            pageSize={ConfigConstant.SUB_ADMIN_LIST_PAGE_SIZE}
          />
        </div>
      )}
      {modalType && (
        <AddAdminModal
          cancelModal={cancelModal}
          source={modalType}
          editOrReadSubMainInfo={editOrReadSubMainInfo}
          existSubAdminNum={subAdminList.length}
        />
      )}
      {}
    </div>
  );
};
