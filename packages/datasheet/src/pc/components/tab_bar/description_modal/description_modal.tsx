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

import { Modal } from 'antd';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import { debounce, isEmpty } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, shallowEqual, useDispatch } from 'react-redux';
import { Api, INodeDescription, IReduxState, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { CloseCircleOutlined, CloseOutlined } from '@apitable/icons';
import { ContextName, ShortcutContext } from 'modules/shared/shortcut_key';
import { useGetDesc } from 'pc/components/custom_page/hooks/use_get_desc';
import { CustomPageAtom } from 'pc/components/custom_page/store/custon_page_desc_atom';
import { Deserializer, IEditorData, Serializer, SlateEditor } from 'pc/components/slate_editor';
import { useImageUpload } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import { stopPropagation } from '../../../utils/dom';
import { automationStateAtom } from '../../automation/controller';
import { useAutomationResourcePermission } from '../../automation/controller/use_automation_permission';
import styles from './style.module.less';

const SLATE_EDITOR_TYPE = 'slate';

interface IRenderModalBase {
  visible: boolean;
  onClose: () => void;
  activeNodeId: string;
  datasheetName: string | null;
  modalStyle?: React.CSSProperties;
  onChange?: (value: string) => void;
  isMobile?: boolean;
}

const getDefaultValue = (desc: INodeDescription | null) => {
  if (isEmpty(desc)) return '';
  if (desc.type === SLATE_EDITOR_TYPE) return desc.data;
  return Deserializer.html(desc.render);
};

const getJsonValue = (value?: string) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (_e) {
    return null;
  }
};

const useGetPermission = (nodeId: string) => {
  const permissionsOrigin = useAppSelector((state) => Selectors.getPermissions(state));
  const permissionAutomations = useAutomationResourcePermission();
  const [embedPage] = useAtom(CustomPageAtom);

  if (nodeId.startsWith('aut')) {
    return permissionAutomations;
  }

  if (nodeId.startsWith('cup') && embedPage?.permission) {
    return embedPage.permission;
  }

  return permissionsOrigin;
};

const useGetNodeDesc = (nodeId: string) => {
  const descDst = useAppSelector((state) => {
    return Selectors.getNodeDesc(state);
  }, shallowEqual);
  const [automationState] = useAtom(automationStateAtom);
  const [embedPage] = useAtom(CustomPageAtom);

  if (nodeId.startsWith('aut')) {
    return getJsonValue(automationState?.robot?.description);
  }

  if (nodeId.startsWith('cup') && embedPage?.desc) {
    return getJsonValue(embedPage.desc);
  }

  return descDst;
};

const RenderModalBase: React.FC<React.PropsWithChildren<IRenderModalBase>> = (props) => {
  const { visible, onClose, activeNodeId, onChange, datasheetName, modalStyle, isMobile } = props;
  const dispatch = useDispatch();
  const nodeDesc = useGetNodeDesc(props.activeNodeId);

  const [value, setValue] = useState(getDefaultValue(nodeDesc));
  const permissions = useGetPermission(props.activeNodeId);
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state)!);
  const { uploadImage } = useImageUpload();
  // This ref is mainly used to prevent cursor changes from triggering repeated submissions of the same data
  const editorHtml = useRef('');
  const { mutate } = useGetDesc(false);

  const onCancel = (e: any, isButton?: boolean) => {
    stopPropagation(e);
    const isExitInnerText = null;
    if (!isExitInnerText) {
      // Content is empty, no pop-up box
      if (!isButton) {
        onClose();
      }
      return;
    }
    Modal.confirm({
      title: t(Strings.operate_info),
      content: t(Strings.confirm_cancel),
      onOk: () => {
        if (!isButton) {
          onClose();
        }
      },
      type: 'warning',
    });
  };

  useEffect(() => {
    ShortcutContext.bind(ContextName.modalVisible, () => true);
    return () => {
      ShortcutContext.unbind(ContextName.modalVisible);
    };
  });

  const errModal = (message?: string) => {
    Modal.warning({
      title: t(Strings.operate_warning),
      content: message ? message : t(Strings.description_save_error),
      okText: t(Strings.submit),
    });
  };

  // eslint-disable-next-line
  const save = useCallback(
    debounce(async (next: IEditorData) => {
      const html = Serializer.html(next.document);
      if (editorHtml.current === html) return;
      editorHtml.current = html;
      const descStruct = {
        type: SLATE_EDITOR_TYPE,
        data: next.document,
        render: editorHtml.current,
      };

      const res = await Api.changeNodeDesc(activeNodeId, JSON.stringify(descStruct));
      const { success, message } = res.data;
      if (success) {
        // Node description saved successfully
        dispatch(StoreActions.recordNodeDesc(datasheetId, JSON.stringify(descStruct)));
        onChange?.(JSON.stringify(descStruct));
        mutate();
      } else {
        // Node description failed to save, error message, but does not change edit status
        errModal(message);
      }
    }, 500),
    [],
  );

  const handleChange = useCallback(
    (next: IEditorData) => {
      setValue(next);
      save(next);
    },
    [save],
  );

  function mobileTitle() {
    return (
      <div
        style={{
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {datasheetName}
      </div>
    );
  }

  const readOnly = !permissions.descriptionEditable || isMobile;

  return (
    <Modal
      destroyOnClose
      visible={visible}
      mask
      footer={null}
      width={'90%'}
      style={{ ...modalStyle, maxWidth: 640 }}
      title={mobileTitle()}
      closeIcon={isMobile ? <></> : <CloseOutlined />}
      onCancel={onCancel}
      bodyStyle={{ padding: '0 0 24px 0' }}
      keyboard
      centered
      className={classNames(styles.descModal, { [styles.mobileModal]: isMobile })}
    >
      {
        <SlateEditor
          onChange={handleChange}
          value={value}
          readOnly={readOnly}
          sectionSpacing="small"
          height="calc(70vh - 118px)"
          imageUploadApi={uploadImage}
        />
      }
      {isMobile && (
        <div className={styles.mobileCloseButton} onClick={onCancel}>
          <CloseCircleOutlined size={32} />
        </div>
      )}
    </Modal>
  );
};

export const RenderModal = React.memo(RenderModalBase);

export function sanitized(str: string) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.innerText.slice(0, 120);
}

export const elementHasChild = (str: string) => {
  const div = document.createElement('div');
  div.innerHTML = str;
  const imgs = div.querySelectorAll('img');
  return Boolean(imgs.length || div.innerText.length);
};

const htmlReg = /<[^>]+>/g;

export const htmlElmentHasText = (str: string) => {
  if (!str) return false;
  /**
   * html => plain text => filtered spaces,
   * Description of whether to display, if it is only spaces, will lose height, treat only spaces as no content
   */
  return str.replace(htmlReg, '').replace(/\s/g, '');
};

interface IDescriptionModal {
  activeNodeId: string;
  datasheetName: string;
  className?: string;
  showIntroduction?: boolean;
  modalStyle?: React.CSSProperties;
  isMobile?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
  onChange?: (value: string) => void;
  onVisibleChange?: () => void;
}

function polyfillData(oldData: string[] | { [key: string]: string[] } | null) {
  if (oldData == null) {
    return [];
  }
  if (Object.prototype.toString.call(oldData) === '[object Object]') {
    // Compatible processing of old data
    const result = [...new Set(Object.values(oldData).flat(1))];
    setStorage(StorageName.Description, result, StorageMethod.Set);
    return result;
  }
  if (Array.isArray(oldData)) {
    return oldData;
  }
  return [];
}

/**
 * share description modal for datasheet and automation
 * @param props
 * @constructor
 */
export const DescriptionModal: React.FC<React.PropsWithChildren<IDescriptionModal>> = (props) => {
  const { activeNodeId, datasheetName, showIntroduction = true, onVisibleChange, className, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const desc = useGetNodeDesc(props.activeNodeId);

  const curGuideWizardId = useAppSelector((state: IReduxState) => state.hooks?.curGuideWizardId);

  useEffect(() => {
    const storage = polyfillData(getStorage(StorageName.Description)) || [];
    const inGuiding = Boolean(curGuideWizardId !== -1);
    if (!storage || !storage.includes(activeNodeId)) {
      setStorage(StorageName.Description, [activeNodeId]);
      if (desc && elementHasChild(desc.render || '') && !inGuiding) {
        setVisible(true);
      }
    }
    // eslint-disable-next-line
  }, [activeNodeId]);

  return (
    <div
      className={classNames(styles.desc, className)}
      onClick={() => {
        setVisible(true);
        props.onClick && props.onClick();
      }}
    >
      {showIntroduction && (
        <div className={styles.text}>{desc && htmlElmentHasText(desc.render) ? sanitized(desc.render) : t(Strings.edit_node_desc)}</div>
      )}
      {visible && (
        <RenderModal
          visible={visible}
          onClose={() => {
            setVisible(false);
            onVisibleChange?.();
          }}
          activeNodeId={activeNodeId}
          datasheetName={datasheetName}
          {...rest}
        />
      )}
    </div>
  );
};

export const expandNodeDescription = ({
  datasheetName,
  activeNodeId,
  isMobile,
}: Pick<IRenderModalBase, 'datasheetName' | 'activeNodeId' | 'isMobile'>) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  const onClose = () => {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  root.render(
    <Provider store={store}>
      <RenderModal
        visible
        onClose={onClose}
        activeNodeId={activeNodeId}
        datasheetName={datasheetName}
        isMobile={isMobile}
        modalStyle={isMobile ? { top: 12 } : undefined}
      />
    </Provider>,
  );
};
