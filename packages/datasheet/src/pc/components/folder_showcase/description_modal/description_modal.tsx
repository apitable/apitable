import { FC, useRef, useState } from 'react';
import * as React from 'react';
import { BaseModal } from 'pc/components/common';
import { IShowCaseData, Selectors } from '@vikadata/core';
import styles from './style.module.less';
import { useMount, useDebounceFn } from 'ahooks';
import { useRequest } from 'pc/hooks';
import { useCatalogTreeRequest, useImageUpload, useResponsive } from 'pc/hooks';
import { useSelector } from 'react-redux';
import { Network } from 'pc/components/network_status';
// import classNames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { SlateEditor, Deserializer, EditorValue, IEditorData, Serializer } from 'pc/components/slate_editor';

export interface IDescriptionModalProps {
  onCancel: () => void;
  nodeInfo: IShowCaseData;
  updateDesc: (data: string) => void;
  changeNetwork?: React.Dispatch<React.SetStateAction<Network>>;
}

const polyfillData = (description: string) => {
  if (!description) {
    return null;
  }
  const data = JSON.parse(description);
  if (data.slateData) {
    return data.slateData;
  }
  if (data.data === '<p><br></p>') {
    return null;
  }
  return Deserializer.html(data.data);
};

export const DescriptionModal: FC<IDescriptionModalProps> = props => {
  const { nodeInfo, updateDesc } = props;
  const [value, setValue] = useState<EditorValue | IEditorData>(polyfillData(nodeInfo.description));
  const [description, setDescription] = useState(nodeInfo.description);
  const descHtml = useRef('');
  const nodeId = useSelector(state => Selectors.getNodeId(state))!;
  const { updateNodeDescriptionReq } = useCatalogTreeRequest();
  const { uploadImage } = useImageUpload();
  const { run: updateNodeDescrition } = useRequest(updateNodeDescriptionReq, { manual: true });
  const { run: sendUpdateDesc } = useDebounceFn(
    async(nodeId, desc) => {
      await updateNodeDescrition(nodeId, desc);
    },
    { wait: 500 },
  );
  useMount(() => {
    if (nodeInfo.description) {
      setValue(polyfillData(nodeInfo.description));
    }
  });

  const { screenIsAtLeast } = useResponsive();
  const isPc = screenIsAtLeast(ScreenSize.md);

  const changeContent = (slateData: IEditorData) => {
    const html = Serializer.html(slateData.document);
    if (html === descHtml.current) return;
    descHtml.current = html;
    const dataStruct = {
      text: Serializer.text(slateData.document),
      slateData,
      // 实际存储的是html dom树，正式替换为slate编辑器后将字段名改为html更好
      data: html,
    };
    setValue(slateData);
    const desc = JSON.stringify(dataStruct);
    setDescription(desc);
    if (nodeInfo.permissions.descriptionEditable) {
      sendUpdateDesc(nodeId, desc);
    }
  };

  const onClose = () => {
    updateDesc(description);
    props.onCancel();
  };

  const editorContent = (
    <div className={styles.editor}>
      <SlateEditor
        onChange={changeContent}
        imageUploadApi={uploadImage}
        value={value}
        sectionSpacing="small"
        autoFocus
        readOnly={!nodeInfo.permissions.descriptionEditable}
        height={isPc ? '70vh' : 'calc(90vh - 94px)'}
      />
    </div>
  );

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <BaseModal width={605} title={nodeInfo.nodeName} onCancel={onClose} footer={null}>
          {editorContent}
        </BaseModal>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup title={nodeInfo.nodeName} height={'90%'} visible className={styles.folderShowCaseDrawer} onClose={onClose}>
          {editorContent}
        </Popup>
      </ComponentDisplay>
    </>
  );
};
