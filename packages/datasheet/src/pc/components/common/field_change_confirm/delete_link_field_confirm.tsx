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

import { Button, TextButton, ThemeProvider } from '@apitable/components';
import { CollaCommandName, ILinkField, Selectors, Strings, t } from '@apitable/core';
import { useLocalStorageState } from 'ahooks';
import { Modal, Radio } from 'antd';
import Image from 'next/image';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { LinkJump, Modal as CustomModal } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import UnlinkImg from 'static/icon/datasheet/datasheet_img_disassociate.png';
import { TComponent } from '../t_component';
import styles from './styles.module.less';
import { CloseOutlined } from '@apitable/icons';

const DeleteLinkField: React.FC<React.PropsWithChildren<{ fieldId: string, datasheetId?: string, onClose: (confirm?: boolean) => void }>> = props => {
  const { fieldId, datasheetId, onClose } = props;
  const datasheet = useSelector(state => Selectors.getDatasheet(state, datasheetId))!;
  const field = datasheet.snapshot.meta.fieldMap[fieldId] as ILinkField;
  const foreignDatasheet = useSelector(state => Selectors.getDatasheet(state, field.property.foreignDatasheetId));
  const foreignDatasheetEditable = useSelector(state => Selectors.getPermissions(state, field.property.foreignDatasheetId).editable);
  const foreignField = foreignDatasheet && foreignDatasheet.snapshot.meta.fieldMap[field.property.brotherFieldId!];
  const [_shouldDelForeign, setShouldDelForeign] = useLocalStorageState('shouldDelForeignField', { defaultValue: false });
  /**
   * No editable permissions for related tables, no permission to use delete fields in advanced rules, 
   * default conversion of sibling fields in related tables to text fields
   **/ 
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
      <CloseOutlined className={styles.close} onClick={() => onClose()} />
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
          <TextButton size='small' onClick={() => onClose()}>{t(Strings.cancel)}</TextButton>
          <Button size='small' color='primary' onClick={onConfirm}>{t(Strings.submit)}</Button>
        </div>
      </div>
    </div>
  );
};

export const deleteLinkFieldConfirm = (props: {
  fieldId: string;
  datasheetId?: string;
  onCancel?: () => void;
  onOk?: () => void
}) => {
  const { fieldId, datasheetId, onCancel = () => { return; }, onOk = () => { return; } } = props;
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const field = snapshot.meta.fieldMap[fieldId];

  // In some cases, data consistency can be corrupted, and the user is prompted here.
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
  const root = createRoot(container);
  const onClose = async(confirm?: boolean) => {
    if (!datasheetId) {
      await ShortcutActionManager.trigger(ShortcutActionName.Focus);
    }
    root.unmount();
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

  root.render((
    <Provider store={store}>
      <ConfirmModalWithTheme />
    </Provider>
  ));
};
