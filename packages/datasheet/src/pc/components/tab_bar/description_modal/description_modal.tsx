import { Api, IReduxState, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { DescriptionOutlined } from '@vikadata/icons';
import { Modal } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { ContextName, ShortcutContext } from 'pc/common/shortcut_key';
import { Deserializer, IEditorData, Serializer, SlateEditor } from 'pc/components/slate_editor';
import { useImageUpload } from 'pc/hooks';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, shallowEqual, useDispatch, useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import IconClose from 'static/icon/datasheet/datasheet_icon_tagdelete.svg';
import { stopPropagation } from '../../../utils/dom';
import styles from './style.module.less';

const SLATE_EDITOR_TYPE = 'slate';

interface IRenderModalBase {
  visible: boolean;
  onClose: () => void;
  activeNodeId: string;
  datasheetName: string;
  modalStyle?: React.CSSProperties;
  isMobile?: boolean;
}

const getDefaultValue = (desc) => {
  if (!desc) return '';
  if (desc.type === SLATE_EDITOR_TYPE) return desc.data;
  return Deserializer.html(desc.render);
};

const RenderModalBase: React.FC<IRenderModalBase> = props => {
  const { visible, onClose, activeNodeId, datasheetName, modalStyle, isMobile } = props;
  const dispatch = useDispatch();
  const nodeDesc = useSelector(state => Selectors.getNodeDesc(state), shallowEqual);
  const [value, setValue] = useState(getDefaultValue(nodeDesc));
  const permissions = useSelector(state => Selectors.getPermissions(state));
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state)!);
  const { uploadImage } = useImageUpload();
  // 这个ref主要用于防止光标改变触发重复提交相同的数据
  const editorHtml = useRef('');

  const onCancel = (e, isButton?: boolean) => {
    stopPropagation(e);
    const isExitInnerText = null;
    if (!isExitInnerText) {
      // 内容为空，不弹出提示框
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const save = useCallback(debounce(async(next: IEditorData) => {
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
      // 节点描述保存成功
      dispatch(StoreActions.recordNodeDesc(datasheetId, JSON.stringify(descStruct)));
    } else {
      // 节点描述保存失败，错误提示，但是不改变编辑状态
      errModal(message);
    }
  }, 500), []);

  const handleChange = useCallback((next: IEditorData) => {
    setValue(next);
    save(next);
  }, [save]);

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
      closeIcon={isMobile ? <></> : <CloseIcon style={{}} />}
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
          sectionSpacing='small'
          height='calc(70vh - 118px)'
          imageUploadApi={uploadImage}
        />
      }
      {
        isMobile &&
        <div className={styles.mobileCloseButton} onClick={onCancel}>
          <IconClose width={32} height={32} />
        </div>
      }
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
   * html => 纯文本 => 过滤空格,
   * 描述是否显示，如果是只有空格，会失去高度，把只有空格当做没有内容
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
}

// FIXME: 目前是 0.4.5，两个版本以后可以删除这段兼容代码
function polyfillData(oldData: string[] | { [key: string]: string[] } | null) {
  if (oldData == null) {
    return [];
  }
  if (Object.prototype.toString.call(oldData) === '[object Object]') {
    // 对旧数据的兼容处理
    const result = [...new Set(Object.values(oldData).flat(1))];
    setStorage(StorageName.Description, result, StorageMethod.Set);
    return result;
  }
  if (Array.isArray(oldData)) {
    return oldData;
  }
  return [];
}

export const DescriptionModal: React.FC<IDescriptionModal> = props => {
  const { activeNodeId, datasheetName, showIntroduction = true, className, showIcon = true, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const desc = useSelector(state => Selectors.getNodeDesc(state), shallowEqual);
  const curGuideWizardId = useSelector((state: IReduxState) => state.hooks.curGuideWizardId);

  useEffect(() => {
    const storage = polyfillData(getStorage(StorageName.Description)) || [];
    const inGuiding = Boolean(curGuideWizardId !== -1);
    if (!storage || !storage.includes(activeNodeId)) {
      setStorage(StorageName.Description, [activeNodeId]);
      if (desc && elementHasChild(desc.render || '') && !inGuiding) {
        setVisible(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodeId]);

  return (
    <div
      className={
        classNames(styles.desc, className)
      }
      onClick={() => {
        setVisible(true);
        props.onClick && props.onClick();
      }}
    >
      {showIcon && <DescriptionOutlined size={16} />}
      {
        showIntroduction &&
        <div className={styles.text}>{desc && htmlElmentHasText(desc.render) ? sanitized(desc.render) : t(Strings.edit_node_desc)}</div>
      }
      {visible && <RenderModal
        visible={visible}
        onClose={() => setVisible(false)}
        activeNodeId={activeNodeId}
        datasheetName={datasheetName}
        {...rest}
      />}
    </div>
  );
};

export const expandNodeDescription = ({ datasheetName, activeNodeId, isMobile }) => {
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

