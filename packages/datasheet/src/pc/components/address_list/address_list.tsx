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

import { Alert } from '@apitable/components';
import { IReduxState, StoreActions, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import * as React from 'react';
import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import OrgImage from 'static/icon/organization/organization_img_default.png';
import { ComponentDisplay } from '../common/component_display';
import { ScreenSize } from '../common/component_display/enum';
import { CommonSide } from '../common_side';
// @ts-ignore
import { isContactSyncing, isSocialDingTalk } from 'enterprise';
import { MobileBar } from '../mobile_bar';
import { MemberInfo } from './member_info';
import { MemberList } from './member_list';
import styles from './style.module.less';

export const AddressList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedTeamInfo, memberList, memberInfo, spaceId, spaceInfo, user } = useSelector(
    (state: IReduxState) => ({
      selectedTeamInfo: state.addressList.selectedTeamInfo,
      memberList: state.addressList.memberList,
      memberInfo: state.addressList.memberInfo,
      teamList: state.addressList.teamList,
      spaceId: state.space.activeId || '',
      spaceInfo: state.space.curSpaceInfo,
      user: state.user.info,
    }),
    shallowEqual,
  );
  // Permission-related information
  // const [isMainAdmin, setIsMainAdmin] = useState(false);
  // const [permissionList, setPermissionList] = useState<string[]>([]);
  const contactSyncing = isSocialDingTalk?.(spaceInfo) && isContactSyncing?.(spaceInfo);

  useEffect(() => {
    dispatch(StoreActions.getTeamListData(user!));
  }, [spaceId, dispatch, user]);

  useEffect(() => {
    selectedTeamInfo.teamId && dispatch(StoreActions.getMemberListData(selectedTeamInfo.teamId));
  }, [spaceId, selectedTeamInfo, dispatch]);

  // Get permission
  useEffect(() => {
    dispatch(StoreActions.spaceResource());
    // eslint-disable-next-line
  }, [spaceId, dispatch, user!.isAdmin, user!.isMainAdmin]);

  const MainComponent = () => (
    <div className={styles.rightWrapper}>
      {selectedTeamInfo && selectedTeamInfo.teamId && (
        <div className={styles.teamTitle}>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={selectedTeamInfo.teamTitle} placement="bottomLeft" textEllipsis>
              <div className={styles.title}>{selectedTeamInfo.teamTitle}</div>
            </Tooltip>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <div className={styles.title}>{selectedTeamInfo.teamTitle}</div>
          </ComponentDisplay>
          <span>
            （{memberList.length}
            {t(Strings.person)}）
          </span>
        </div>
      )}
      <div className={styles.memberWrapper}>
        {memberList.length > 0 ? (
          <>
            <div className={styles.memberList}>
              {contactSyncing && (
                <div style={{ padding: '0 20px 24px' }}>
                  <Alert type="default" content={t(Strings.dingtalk_admin_contact_syncing_tips)} />
                </div>
              )}
              <MemberList memberList={memberList} />
            </div>
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <div className={styles.memberInfo}>
                {memberInfo.memberId ? (
                  <MemberInfo />
                ) : (
                  <span className={styles.emptyImage}>
                    <Image src={OrgImage} alt={t(Strings.empty_data)} />
                  </span>
                )}
              </div>
            </ComponentDisplay>
          </>
        ) : (
          <span className={styles.emptyImage}>
            <Image src={OrgImage} alt={t(Strings.empty_data)} />
          </span>
        )}
      </div>
    </div>
  );
  return (
    <div className={styles.addressList}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <SplitPane minSize={280} maxSize={800} defaultSize={280}>
          <div className={styles.splitLeft}>
            <CommonSide />
          </div>
          <div className={styles.splitRight}>{MainComponent()}</div>
        </SplitPane>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        {MainComponent()}
      </ComponentDisplay>
    </div>
  );
};
