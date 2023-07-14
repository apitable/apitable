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
import { Skeleton } from '@apitable/components';
import { INodeRoleMap, Strings, t } from '@apitable/core';
import cls from 'classnames';
import { Tabs, TabsProps } from 'antd';
import { ScreenSize } from 'pc/components/common/component_display';
import { NodeChangeInfoType, useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MembersDetail } from '../permission_settings_plus/permission/members_detail';
import { PublicShareInviteLink } from './public_link';
import styles from './style.module.less';
import { IMemberList } from 'pc/components/catalog/permission_settings_plus/permission';
import { IShareContentProps } from './interface';
import { PermissionAndCollaborator } from './permission_and_collaborator';

export const ShareContent: FC<React.PropsWithChildren<IShareContentProps>> = ({ data, defaultActiveKey = 'Invite', isAI }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const socketData = useSelector(state => state.catalogTree.socketData);
  const { getNodeRoleListReq, getCollaboratorListPageReq } = useCatalogTreeRequest();
  const {
    run: getNodeRoleList,
    data: roleList,
    loading
  } = useRequest<INodeRoleMap>(() => getNodeRoleListReq(data.nodeId));
  const [pageNo, setPageNo] = useState<number>(1);
  const [memberList, setMemberList] = useState<IMemberList[]>([]);
  const {
    run: getCollaboratorReq,
    data: collaboratorInfo
  } = useRequest((pageNo) => getCollaboratorListPageReq(pageNo, data.nodeId), {
    manual: true
  });

  useEffect(() => {
    getCollaboratorReq(pageNo);
  }, [pageNo, getCollaboratorReq]);

  useEffect(() => {
    if (collaboratorInfo) {
      setMemberList([...memberList, ...collaboratorInfo.records]);
    }
    // eslint-disable-next-line
  }, [collaboratorInfo, setMemberList]);

  useEffect(() => {
    if (socketData && socketData.type === NodeChangeInfoType.UpdateRole) {
      getNodeRoleList();
    }
  }, [socketData, getNodeRoleList]);

  if (loading) {
    return (
      <div className={cls(styles.shareContent, styles.loading, { [styles.shareContentMobile]: isMobile })}>
        <Skeleton count={1} style={{ marginTop: 0 }} width='25%' height='24px'/>
        <Skeleton count={2} style={{ marginTop: '16px' }} height='24px'/>
        <Skeleton count={1} style={{ marginTop: '58px' }} width='25%' height='24px'/>
        <Skeleton count={1} style={{ marginTop: '16px' }} height='24px'/>
      </div>
    );
  }

  const renderTabs = () => {
    const items: TabsProps['items'] = [
      {
        key: 'Invite',
        label: t(Strings.invite),
        children: (
          <PermissionAndCollaborator
            roleList={roleList}
            data={data}
            pageNo={pageNo}
            getNodeRoleList={getNodeRoleList}
            setDetailModalVisible={setDetailModalVisible}
          />
        ),
      },
      {
        key: 'Publish',
        label: t(Strings.publish),
        children: (
          <PublicShareInviteLink
            isAI={isAI}
            nodeId={data.nodeId}
            isMobile={isMobile}
          />
        ),
      },
    ];
    return (
      <Tabs
        style={{ flex: 1 }}
        defaultActiveKey={defaultActiveKey}
        items={items}
      />
    );
  };

  return (
    <>
      <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
        { renderTabs() }
      </div>
      {detailModalVisible && <MembersDetail
        data={collaboratorInfo}
        memberList={memberList}
        setPageNo={setPageNo}
        pageNo={pageNo} onCancel={() => setDetailModalVisible(false)}/>}
    </>
  );
};
