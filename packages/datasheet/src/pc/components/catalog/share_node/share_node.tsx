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

import { FC } from 'react';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { useAppSelector } from 'pc/store/react-redux';
import { ShareContent } from './share_content';
import styles from './style.module.less';

export interface IShareNodeProps {
  /** Information about the node being operated on */
  data: {
    nodeId: string;
    type: ConfigConstant.NodeType;
    icon: string;
    name: string;
  };
  /** Modal Box Visible Control */
  visible: boolean;
  /** Close modal box */
  onClose?: () => void;
  isTriggerRender?: boolean;
}

export enum ShareTab {
  Teamwork = 'teamwork',
  PublicLink = 'publiclink',
}

export const ShareNode: FC<React.PropsWithChildren<IShareNodeProps>> = ({ data, visible, onClose, isTriggerRender }) => {
  const nodeId = data.nodeId;
  const nodeName = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[nodeId]?.nodeName || state.catalogTree.privateTreeNodesMap[nodeId]?.nodeName
  );

  if (isTriggerRender) {
    return <ShareContent data={data} />;
  }

  return (
    <>
      {/* pc */}
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.shareNodeModal}
          open={visible}
          width={528}
          bodyStyle={{ padding: 0 }}
          onCancel={onClose}
          destroyOnClose
          footer={null}
          centered
        >
          <ShareContent data={data} />
        </Modal>
      </ComponentDisplay>

      {/* Mobile */}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          className={styles.shareNodeDrawer}
          open={visible}
          onClose={onClose}
          height="90%"
          title={
            <div className={styles.nodeTitle}>
              <TComponent tkey={t(Strings.share_title)} params={{ node: <div className={styles.name}>{nodeName}</div> }} />
            </div>
          }
        >
          <ShareContent data={data} />
        </Popup>
      </ComponentDisplay>
    </>
  );
};
