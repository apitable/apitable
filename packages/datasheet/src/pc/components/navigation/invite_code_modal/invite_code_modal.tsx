import { Tabs } from 'antd';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { t, Strings } from '@vikadata/core';
import { useSelector } from 'react-redux';
import { MyInviteCode } from './my-invite-code';
import { SubmitInviteCode } from './submit-invite-code';
import { BubbleBox } from './bubble-box/bubble-box';

const { TabPane } = Tabs;

interface IInviteCodeModal {
  setShowInviteCode: React.Dispatch<React.SetStateAction<boolean>>
}

export const InviteCodeModal: FC<IInviteCodeModal> = ({ setShowInviteCode }) => {
  const userInfo = useSelector(state => state.user.info);
  const inviteCode = userInfo?.inviteCode!;
  const usedInviteReward = userInfo?.usedInviteReward;

  return (
    <div>
      <Modal
        className={styles.modal}
        title={t(Strings.invite_code)}
        visible
        width={560}
        footer={null}
        centered
        onCancel={() => { setShowInviteCode(false); }}
      >
        {
          usedInviteReward
            ?
            <MyInviteCode inviteCode={inviteCode} />
            :
            <Tabs>
              <TabPane tab={t(Strings.invite_code_tab_mine)} key="1">
                <MyInviteCode inviteCode={inviteCode} />
              </TabPane>
              <TabPane tab={<div className={styles.tab}>{t(Strings.invite_code_tab_submit)}<BubbleBox /></div>} key="2">
                <SubmitInviteCode submitAndSuccess={() => setShowInviteCode(false)} myInviteCode={inviteCode} />
              </TabPane>
            </Tabs>
        }
      </Modal>
    </div>
  );
};
