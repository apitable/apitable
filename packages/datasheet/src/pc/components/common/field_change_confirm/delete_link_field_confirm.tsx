import { Button, TextButton, ThemeProvider } from '@vikadata/components';
import { CollaCommandName, ILinkField, Selectors, Strings, t } from '@vikadata/core';
import { useLocalStorageState } from 'ahooks';
import { Modal, Radio } from 'antd';
import Image from 'next/image';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { LinkJump, Modal as CustomModal } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_small.svg';
import UnlinkImg from 'static/icon/datasheet/datasheet_img_disassociate.png';
import { TComponent } from '../t_component';
import styles from './styles.module.less';

const DeleteLinkField: React.FC<{ fieldId: string, datasheetId?: string, onClose(confirm?: boolean) }> = props => {
  const { fieldId, datasheetId, onClose } = props;
  const datasheet = useSelector(state => Selectors.getDatasheet(state, datasheetId))!;
  const field = datasheet.snapshot.meta.fieldMap[fieldId] as ILinkField;
  const foreignDatasheet = useSelector(state => Selectors.getDatasheet(state, field.property.foreignDatasheetId));
  const foreignDatasheetEditable = useSelector(state => Selectors.getPermissions(state, field.property.foreignDatasheetId).editable);
  const foreignField = foreignDatasheet && foreignDatasheet.snapshot.meta.fieldMap[field.property.brotherFieldId!];
  const [_shouldDelForeign, setShouldDelForeign] = useLocalStorageState('shouldDelForeignField', { defaultValue: false });
  // 没有关联表的可编辑权限，不允许使用高级规则里的删除字段，默认将关联表的兄弟字段转换成文本字段
  const shouldDelForeign = foreignDatasheetEditable ? _shouldDelForeign : false;

  function onConfirm() {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteField,
      data: [{
        deleteBrotherField: shouldDelForeign,
        fieldId,
      }],
    });
    onClose(true);
  }

  return (
    <div className={styles.deleteConfirmContainer}>
      <h1 className={styles.title}>{t(Strings.delete_field)}</h1>
      <CloseIcon className={styles.close} onClick={() => onClose()} />
      <div className={styles.unLinkImg}>
        <Image src={UnlinkImg} alt={t(Strings.delete_field)} />
      </div>
      <div className={styles.datasheetInfo}>
        <h4 className={styles.datasheetName}>{t(Strings.current_datasheet)}：{datasheet.name}</h4>
        <p className={styles.fieldDesc}>{t(Strings.delete_field)} “{<b>{field.name}”</b>} </p>
      </div>
      {
        foreignField && foreignDatasheet && (
          <div className={styles.datasheetInfo}>
            <h4 className={styles.datasheetName}>
              {t(Strings.association_table)}：{foreignDatasheet.name}
              <LinkJump foreignDatasheetId={foreignDatasheet.id} />
            </h4>
            {
              <Radio.Group onChange={e => setShouldDelForeign(e.target.value)} value={shouldDelForeign}>
                <p className={styles.fieldDesc}>
                  <Radio value={false}>
                    <span className={styles.text}>
                      {<TComponent
                        tkey={t(Strings.change_field_to_multi_text_field)}
                        params={{
                          b: <b>{foreignField.name}</b>,
                        }}
                      />}
                    </span>
                  </Radio>
                </p>
                <p className={styles.fieldDesc}>
                  <Radio value disabled={!foreignDatasheetEditable}>
                    <span className={styles.text}>{t(Strings.delete_field)} “{<b>{foreignField.name}”</b>} </span>
                  </Radio>
                </p>
              </Radio.Group>
            }
          </div>
        )
      }

      <div className={styles.footer}>
        <div className={styles.buttonGroup}>
          <TextButton size="small" onClick={() => onClose()}>{t(Strings.cancel)}</TextButton>
          <Button size="small" color="primary" onClick={onConfirm}>{t(Strings.submit)}</Button>
        </div>
      </div>
    </div>
  );
};

export const deleteLinkFieldConfirm = (props: {
  fieldId: string, datasheetId?: string, onCancel?(), onOk?(),
}) => {
  const { fieldId, datasheetId, onCancel = () => { return; }, onOk = () => { return; } } = props;
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const field = snapshot.meta.fieldMap[fieldId];

  // 某些情况下，数据一致性会被损坏，这里要提示用户。
  if (!field) {
    CustomModal.error({
      title: t(Strings.error),
      content: t(Strings.error_field_not_exist),
      centered: true,
      okText: t(Strings.submit),
    });
    return;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);

  const onClose = (confirm?: boolean) => {
    if (!datasheetId) {
      ShortcutActionManager.trigger(ShortcutActionName.Focus);
    }
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
    confirm ? onOk() : onCancel();
  };

  const ConfirmModalWithTheme = () => {
    const cacheTheme = useSelector(Selectors.getTheme);
    return (
      <ThemeProvider theme={cacheTheme}>
        <Modal
          visible
          centered
          onCancel={() => onClose()}
          destroyOnClose
          footer={null}
          closable={false}
          width={400}
        >
          <DeleteLinkField fieldId={fieldId} datasheetId={datasheetId} onClose={onClose} />
        </Modal>
      </ThemeProvider>
    );
  };

  ReactDOM.render((
    <Provider store={store}>
      <ConfirmModalWithTheme />
    </Provider>
  ),
  container,
  );
};
