import { ConfigConstant, IReduxState, Strings, t } from '@vikadata/core';
import { Tabs } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
// import HeaderPng from 'static/icon/datasheet/share/datasheet_img_share.png';
import InvitePng from 'static/icon/datasheet/share/datasheet_img_share_left.png';
import ShareNodePng from 'static/icon/datasheet/share/datasheet_img_share_right.png';
import { PublicLink } from './public_link';
import { ShareContent } from './share_content';
import styles from './style.module.less';
import { Teamwork } from './teamwork';

const { TabPane } = Tabs;

export interface IShareNodeProps {
  /** 被操作节点相关的信息 */
  data: {
    nodeId: string;
    type: ConfigConstant.NodeType;
    icon: string;
    name: string;
  };
  /** 模态框显隐控制 */
  visible: boolean;
  /** 关闭模态框 */
  onClose?: () => void;
  isTriggerRender?: boolean;
}

export enum ShareTab {
  Teamwork = 'teamwork',
  PublicLink = 'publiclink',
}

export const ShareNode: FC<IShareNodeProps> = ({ data, visible, onClose, isTriggerRender }) => {
  const [activeTab, setActiveTab] = useState(ShareTab.PublicLink);
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const { nodeName } = treeNodesMap[data.nodeId];

  if (isTriggerRender) {
    return <ShareContent data={data} />;
  }

  return (
    <>
      {/* pc端 */}
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.shareNodeModal}
          visible={visible}
          width={786}
          bodyStyle={{ padding: 0 }}
          onCancel={onClose}
          destroyOnClose
          footer={null}
          centered
        >
          <div className={styles.container}>
            <div className={styles.tabs}>
              <div
                className={classnames(styles.tab, { [styles.active]: ShareTab.PublicLink === activeTab })}
                onClick={() => setActiveTab(ShareTab.PublicLink)}
              >
                <div className={styles.tabContent}>
                  <Image src={ShareNodePng} alt="public link" width={144} height={80} />
                  <div className={styles.title}>{t(Strings.public_link)}</div>
                  <div className={styles.subTitle}>{t(Strings.public_link_desc)}</div>
                </div>
              </div>
              <div
                className={classnames(styles.tab, { [styles.active]: ShareTab.Teamwork === activeTab })}
                onClick={() => setActiveTab(ShareTab.Teamwork)}
              >
                <div className={styles.tabContent}>
                  <Image src={InvitePng} alt="teamwork" width={144} height={80} />
                  <div className={styles.title}>{t(Strings.teamwork)}</div>
                  <div className={styles.subTitle}>{t(Strings.teamwork_desc)}</div>
                </div>
              </div>
            </div>
            <div className={styles.tabPanel}>
              <div className={styles.nodeTitle}>
                <TComponent tkey={t(Strings.share_title)} params={{ node: <div className={styles.name}>{nodeName}</div> }} />
              </div>
              <div className={styles.main}>
                {activeTab === ShareTab.Teamwork ? (
                  <Teamwork nodeId={data.nodeId} jumpPublicLink={() => setActiveTab(ShareTab.PublicLink)} />
                ) : (
                  <PublicLink nodeId={data.nodeId} setActiveTab={setActiveTab} />
                )}
              </div>
            </div>
          </div>
        </Modal>
      </ComponentDisplay>

      {/* 移动端 */}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          className={styles.shareNodeDrawer}
          visible={visible}
          onClose={onClose}
          height="90%"
          title={
            <div className={styles.nodeTitle}>
              <TComponent tkey={t(Strings.share_title)} params={{ node: <div className={styles.name}>{nodeName}</div> }} />
            </div>
          }
        >
          <Tabs activeKey={activeTab} onChange={activeKey => setActiveTab(activeKey as ShareTab)} className={styles.tabs}>
            <TabPane tab={t(Strings.public_link)} key={ShareTab.PublicLink}>
              <PublicLink nodeId={data.nodeId} setActiveTab={setActiveTab} />
            </TabPane>
            <TabPane tab={t(Strings.teamwork)} key={ShareTab.Teamwork}>
              <Teamwork nodeId={data.nodeId} jumpPublicLink={() => setActiveTab(ShareTab.PublicLink)} />
            </TabPane>
          </Tabs>
        </Popup>
      </ComponentDisplay>
    </>
  );
};
