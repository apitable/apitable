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
import { FC, useState } from 'react';
// import { useAppSelector, shallowEqual } from 'react-redux';
import SplitPane from 'react-split-pane';
import {
  // IReduxState,
  IMemberInfoInSpace,
  Player,
  Events,
} from '@apitable/core';
// import { EditMemberModal, ChangeMemberTeam, AddMember } from './modal';
import { Loading } from './loading';
import { TeamInfo } from './team_info';
import { TeamTree } from './team_tree';
import styles from './style.module.less';

const _SplitPane: any = SplitPane;

export const SpaceMemberManage: FC<React.PropsWithChildren<unknown>> = () => {
  const [rightLoading, setRightLoading] = useState(false);
  const [searchMemberRes, setSearchMemberRes] = useState<IMemberInfoInSpace[]>([]);
  useMount(() => {
    Player.doTrigger(Events.space_setting_member_manage_shown);
  });

  return (
    <div className={styles.memberManageWrapper}>
      {
        <_SplitPane minSize={199} maxSize={800} defaultSize={199} className={styles.spaceMemberSplit}>
          <TeamTree setSearchMemberRes={(data) => setSearchMemberRes(data)} setRightLoading={setRightLoading} />
          {rightLoading ? (
            <div className={styles.loading}>
              <Loading />
            </div>
          ) : (
            <TeamInfo searchMemberRes={searchMemberRes} setSearchMemberRes={setSearchMemberRes} />
          )}
        </_SplitPane>
      }
    </div>
  );
};
