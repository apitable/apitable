import { Strings, t } from '@apitable/core';
import { InformationSmallOutlined } from '@apitable/icons';
import { ButtonPlus, ContextmenuItem, MobileContextMenu, Modal } from 'pc/components/common';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { getEnvVariables } from 'pc/utils/env';
import RcTrigger from 'rc-trigger';
import { FC, useState } from 'react';
import FeedbackIcon from 'static/icon/common/common_icon_feedback.svg';
import JoinCommunityIcon from 'static/icon/common/group.svg';
import ReportIcon from 'static/icon/datasheet/datasheet_icon_prosecute.svg';
import AdviseIcon from 'static/icon/workbench/workbench_icon_advise.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { ReportReason } from './report_reason';
import styles from './style.module.less';

interface IReportWeb {
  nodeId: string;
}

export const ReportWeb: FC<IReportWeb> = ({ nodeId }) => {
  /** Control menu display */
  const [menuVisible, setMenuVisible] = useState(false);
  /** Control the display of the modal box for filling in the reason for reporting */
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
  // import { IContextMenuData } from '@apitable/components'; 'error'
  const menuData: any[] = [
    [
      {
        icon: <AdviseIcon />,
        text: t(Strings.vomit_a_slot),
        onClick: () => navigationToUrl(getEnvVariables().USER_FEEDBACK_FORM_URL),
      },
      {
        icon: <InformationSmallOutlined />,
        text: t(Strings.help_center),
        onClick: () => navigationToUrl(`${window.location.origin}/help`),
      },
      {
        icon: <ReportIcon />,
        text: t(Strings.inform),
        onClick: () => setReasonModalVisible(true),
      },
      {
        icon: <JoinCommunityIcon />,
        text: t(Strings.join_the_community),
        onClick: () => navigationToUrl(isFeishu ? `${window.location.origin}/feishu/` : `${window.location.origin}/chatgroup/`),
      },
    ],
  ];

  const renderMenu = () => {
    return (
      <div className={styles.feedbackMenu}>
        <div onClick={() => setMenuVisible(false)}>
          {menuData[0].map((item, index) => (
            <ContextmenuItem key={index} name={item.text} icon={item.icon} onClick={item.onClick} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.reportWeb}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action="click"
          popup={renderMenu()}
          destroyPopupOnHide
          popupAlign={{
            points: ['br', 'bl'],
            offset: [-10, 0],
          }}
          popupStyle={{ width: '240px' }}
          popupVisible={menuVisible}
          onPopupVisibleChange={visible => setMenuVisible(visible)}
          zIndex={1000}
        >
          <ButtonPlus.Font onClick={() => setMenuVisible(true)} className={styles.feedbackBtn} icon={<FeedbackIcon />} size="small" shadow />
        </RcTrigger>
        {reasonModalVisible && <ReportReason nodeId={nodeId} onClose={() => setReasonModalVisible(false)} />}
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileContextMenu title={t(Strings.help)} visible={menuVisible} height="50%" data={menuData} onClose={() => setMenuVisible(false)} />
        <ButtonPlus.Font onClick={() => setMenuVisible(true)} className={styles.feedbackBtn} icon={<FeedbackIcon />} size="small" shadow />
        {reasonModalVisible && (
          <Modal className={styles.reasonModal} onCancel={() => setReasonModalVisible(false)} centered footer={null} visible>
            <ReportReason nodeId={nodeId} onClose={() => setReasonModalVisible(false)} />
          </Modal>
        )}
      </ComponentDisplay>
    </div>
  );
};
