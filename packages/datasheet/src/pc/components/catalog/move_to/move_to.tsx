import { Api, IParent, StoreActions, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Message } from 'pc/components/common/message/message';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectFolder } from './select_folder';
import styles from './style.module.less';
import { MobileFooter, MobileTitle, Title } from './title';

export const MoveTo: React.FC<{
  nodeIds: string[]
  onClose?:() => void;
}> = (props) => {
  const { nodeIds, onClose } = props;
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [parentList, setParentList] = useState<IParent[]>([]);
  const { nodeName, parentId } = useSelector(state => {
    const { nodeName, parentId } = state.catalogTree.treeNodesMap[nodeIds[0]];    
    return { nodeName, parentId };
  });
  
  const dispatch = useDispatch();

  const backPreSelected = () => {
    setSelectedNodeId(parentList[parentList.length - 2].nodeId);
  };

  const getParentList = (folderId: string) => {
    Api.getParents(folderId).then(res => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      setParentList(data);
    });
  };

  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }
    getParentList(selectedNodeId);
  }, [selectedNodeId]);

  const main = <SelectFolder selectedFolderId={selectedNodeId} selectedFolderParentList={parentList} onChange={setSelectedNodeId}/>;

  const selectedNodeName = parentList.find(v => v.nodeId === selectedNodeId)?.nodeName;

  const moveTo = () => {
    const nodeId = nodeIds[0];
    if (!nodeId || !selectedNodeId) {
      return;
    }
    // selected nodeId is equal nodeId current parentId
    if (selectedNodeId === parentId) {
      Message.error({ content: t(Strings.move_to_error_equal_parent) });
      return;
    }
    Api.nodeMove(nodeId, selectedNodeId).then(res => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        dispatch(StoreActions.setErr(message));
        return;
      }
      dispatch(StoreActions.moveTo(nodeId, selectedNodeId, 0));
      dispatch(StoreActions.addNodeToMap(data));
      onClose && onClose();
      Message.success({ content: t(Strings.move_to_success) });
    });
  };

  return (
    <div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.moveTo}
          title={<Title nodeName={nodeName} />}
          visible
          centered
          onCancel={onClose}
          okText={t(Strings.move)}
          onOk={moveTo}
        >
          {main}
        </Modal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          visible
          height="90%"
          onClose={onClose}
          className={classNames(styles.moveTo, styles.moveToMobile)}
          title={<MobileTitle
            showBackIcon={parentList.length > 1}
            nodeName={selectedNodeId ? selectedNodeName : t(Strings.move_to)}
            onClick={backPreSelected}
          />}
          footer={selectedNodeId && <MobileFooter onCancel={onClose} onConfirm={moveTo}/>}
        >
          {main}
        </Popup>
      </ComponentDisplay>
    </div>
  );
};
