import { FC, useState } from 'react';
import {
  // IReduxState,
  IMemberInfoInSpace,
  Player, Events,
} from '@vikadata/core';
// import { useSelector, shallowEqual } from 'react-redux';
import { TeamTree } from './team_tree';
import SplitPane from 'react-split-pane';
// import { EditMemberModal, ChangeMemberTeam, AddMember } from './modal';
import styles from './style.module.less';
import { Loading } from './loading';
import { useMount } from 'ahooks';
import { TeamInfo } from './team_info';

export const SpaceMemberManage: FC = () => {
  const [rightLoading, setRightLoading] = useState(false);
  const [searchMemberRes, setSearchMemberRes] = useState<IMemberInfoInSpace[]>([]);
  useMount(() => {
    Player.doTrigger(Events.space_setting_member_manage_shown);
  });

  return (
    <div className={styles.memberManageWrapper}>
      {
        (
          <SplitPane
            minSize={199}
            maxSize={800}
            defaultSize={199}
            className={styles.spaceMemberSplit}
          >
            <TeamTree
              setSearchMemberRes={data => setSearchMemberRes(data)}
              setRightLoading={setRightLoading}
            />
            {
              rightLoading ? <div className={styles.loading}><Loading /></div> :
                <TeamInfo searchMemberRes={searchMemberRes} setSearchMemberRes={setSearchMemberRes} />
            }
          </SplitPane>
        ) 
      }
    </div>
  );
};
