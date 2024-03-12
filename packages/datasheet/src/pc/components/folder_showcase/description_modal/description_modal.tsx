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

import { useDebounceFn } from 'ahooks';
import * as React from 'react';
import { FC, useRef, useState } from 'react';
import { IShowCaseData, Selectors } from '@apitable/core';
import { BaseModal } from 'pc/components/common';
// import classNames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Network } from 'pc/components/network_status';
import { SlateEditor, Deserializer, EditorValue, IEditorData, Serializer } from 'pc/components/slate_editor';
import { useRequest, useCatalogTreeRequest, useImageUpload, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

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

export const DescriptionModal: FC<React.PropsWithChildren<IDescriptionModalProps>> = (props) => {
  const { nodeInfo, updateDesc } = props;
  const [value, setValue] = useState<EditorValue | IEditorData>(polyfillData(nodeInfo.description));
  const [description, setDescription] = useState(nodeInfo.description);
  const descHtml = useRef('');
  const nodeId = useAppSelector((state) => Selectors.getNodeId(state))!;
  const { updateNodeDescriptionReq } = useCatalogTreeRequest();
  const { uploadImage } = useImageUpload();
  const { run: updateNodeDescription } = useRequest(updateNodeDescriptionReq, { manual: true });
  const { run: sendUpdateDesc } = useDebounceFn(
    async (nodeId, desc) => {
      await updateNodeDescription(nodeId, desc);
    },
    { wait: 500 },
  );

  const { screenIsAtLeast } = useResponsive();
  const isPc = screenIsAtLeast(ScreenSize.md);

  const changeContent = (slateData: IEditorData) => {
    const html = Serializer.html(slateData.document);
    if (html === descHtml.current) return;
    descHtml.current = html;
    const dataStruct = {
      text: Serializer.text(slateData.document),
      slateData,
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
        <Popup title={nodeInfo.nodeName} height={'90%'} open className={styles.folderShowCaseDrawer} onClose={onClose}>
          {editorContent}
        </Popup>
      </ComponentDisplay>
    </>
  );
};
