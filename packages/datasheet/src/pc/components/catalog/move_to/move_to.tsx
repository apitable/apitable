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

import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api, ConfigConstant, IParent, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { SelectFolder } from './select_folder';
import { MobileFooter, MobileTitle, Title } from './title';
import styles from './style.module.less';

export const MoveTo: React.FC<
  React.PropsWithChildren<{
    nodeIds: string[];
    onClose?: () => void;
    isPrivate?: boolean;
  }>
> = (props) => {
  const { nodeIds, onClose, isPrivate } = props;
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [catalog, setCatalog] = useState<ConfigConstant.Modules>();
  const [parentList, setParentList] = useState<IParent[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { nodeName, nodePermitSet } = useAppSelector((state) => {
    const nodeMapKey = isPrivate ? 'privateTreeNodesMap' : 'treeNodesMap';
    const { nodeName, nodePermitSet } = state.catalogTree[nodeMapKey][nodeIds[0]];
    return { nodeName, nodePermitSet };
  });
  const userUnitId = useAppSelector((state) => state.user.info?.unitId);
  const rootId = useAppSelector((state) => state.catalogTree.rootId);
  const rootName = useAppSelector((state) => state.catalogTree.treeNodesMap[rootId]?.nodeName);
  const currentNodeId = useAppSelector((state) => state.pageParams.nodeId);

  const dispatch = useDispatch();

  const backPreSelected = () => {
    setSelectedNodeId(parentList[parentList.length - 2].nodeId);
  };

  const getParentList = (folderId: string) => {
    Api.getParents(folderId).then((res) => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      const _data = data.some((v) => v.nodeId === rootId) ? data : [{ nodeId: rootId, nodeName: rootName }, ...data];
      setParentList(_data);
    });
  };

  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }
    getParentList(selectedNodeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId]);

  const main = (
    <SelectFolder
      selectedFolderId={selectedNodeId}
      selectedFolderParentList={parentList}
      onChange={setSelectedNodeId}
      catalog={catalog}
      setCatalog={setCatalog}
      isPrivate={isPrivate}
    />
  );

  const selectedNodeName = parentList.find((v) => v.nodeId === selectedNodeId)?.nodeName;

  const moveTo = () => {
    const nodeId = nodeIds[0];
    if (!nodeId || !selectedNodeId) {
      return;
    }
    // selected nodeId is equal nodeId current parentId
    // if (selectedNodeId === parentId) {
    //   Message.error({ content: t(Strings.move_to_error_equal_parent) });
    //   return;
    // }

    const move = () => {
      setConfirmLoading(true);
      const unitId = catalog === ConfigConstant.Modules.PRIVATE ? userUnitId : undefined;
      Api.nodeMove(nodeId, selectedNodeId, undefined, unitId).then((res) => {
        setConfirmLoading(false);
        const { data, success, message } = res.data;
        console.log('moveTo -> data', data, success, message);
        if (!success) {
          let content: string | React.ReactNode = '';
          if (nodeId.startsWith(ConfigConstant.NodeTypeReg.DATASHEET)) {
            content = t(Strings.move_datasheet_link_warn);
          } else if (nodeId.startsWith(ConfigConstant.NodeTypeReg.FOLDER)) {
            content = t(Strings.move_folder_link_warn);
          } else {
            const nodeType = ConfigConstant.nodePrefixNameMap.get(nodeId.slice(0, 3) as ConfigConstant.NodeTypeReg);
            content = <TComponent
              tkey={t(Strings.move_other_link_warn)}
              params={{ nodeType }}
            />;
          }
          Modal.warning({
            title: t(Strings.please_note),
            content,
          });
          return;
        }
        dispatch(StoreActions.moveTo(nodeId, selectedNodeId, 0, catalog));
        dispatch(StoreActions.addNodeToMap(data, true, catalog));
        onClose && onClose();
        moveSuccess(nodeId);
      });
    };
    if (!nodePermitSet) {
      const modal = Modal.confirm({
        type: 'warning',
        title: t(Strings.set_permission_include_oneself_tips_title),
        content: (
          <TComponent
            tkey={t(Strings.move_node_modal_content)}
            params={{
              nodeSet: (
                <span
                  className={styles.permissionSetBtn}
                  onClick={() => {
                    dispatch(StoreActions.updatePermissionModalNodeId(nodeId));
                    modal.destroy();
                  }}
                >
                  {t(Strings.permission_setting)}
                </span>
              ),
            }}
          />
        ),
        onOk: () => {
          move();
        },
      });
      return;
    }
    move();
  };

  const moveSuccess = (nodeId: string) => {
    const isDifferent = currentNodeId !== nodeId;
    Message.success({
      content: (
        <>
          {t(Strings.move_to_success)}
          {isDifferent && (
            <i
              onClick={() =>
                Router.redirect(Navigation.WORKBENCH, {
                  params: {
                    nodeId: nodeId,
                  },
                })
              }
            >
              {t(Strings.to_view_dashboard)}
            </i>
          )}
        </>
      ),
    });
  };

  return (
    <div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.moveTo}
          title={<Title nodeName={nodeName} />}
          open
          centered
          onCancel={onClose}
          okText={t(Strings.move)}
          confirmLoading={confirmLoading}
          onOk={moveTo}
        >
          {main}
        </Modal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open
          height="90%"
          onClose={onClose}
          className={classNames(styles.moveTo, styles.moveToMobile)}
          title={
            <MobileTitle
              showBackIcon={parentList.length > 1}
              nodeName={selectedNodeId ? selectedNodeName : t(Strings.move_to)}
              onClick={backPreSelected}
            />
          }
          footer={selectedNodeId && <MobileFooter confirmLoading={confirmLoading} onCancel={onClose} onConfirm={moveTo} />}
        >
          {main}
        </Popup>
      </ComponentDisplay>
    </div>
  );
};
