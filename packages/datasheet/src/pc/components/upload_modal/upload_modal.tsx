import { IAttachmentValue, IField, RowHeightLevel, Strings, t } from '@apitable/core';
import { Modal } from 'antd';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useThemeColors } from '@vikadata/components';
import { useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BulkDownload } from '../preview_file/preview_main/bulk_download';
import { Memory } from './memory';
import styles from './styles.module.less';
import { UploadCore } from './upload_core';
import { CloseMiddleOutlined } from '@vikadata/icons';
import { useAllowDownloadAttachment } from 'pc/components/upload_modal/preview_item';

interface IUploadAttachment {
  datasheetId: string;
  recordId: string;
  field: IField;
  cellValue: IAttachmentValue[];
  isInWebsite?: boolean;
  visible?: boolean;
  setVisible?: (visible) => void;
  rowHeightLevel?: RowHeightLevel;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  editable?: boolean;
}

export const UploadModal: React.FC<IUploadAttachment> = props => {
  const colors = useThemeColors();
  const {
    recordId,
    field,
    datasheetId,
    cellValue,
    rowHeightLevel,
    visible: _visible,
    setVisible: _setVisible,
    onSave,
  } = props;
  const isInWebsite = useSelector(state => state.space.activeId);
  const [visible, setVisible] = useState(_visible ?? true);
  const allowedDownload = useAllowDownloadAttachment(field.id);

  function closeFn() {
    if (_setVisible) {
      _setVisible(false);
    } else {
      setVisible(false);
    }
    ShortcutActionManager.trigger(ShortcutActionName.ToggleEditing);
  }

  const Footer = (
    <div
      className={styles.footer}
      style={{
        borderTop: cellValue?.length ? `1px solid ${colors.lineColor}` : `1px solid ${colors.defaultBg}`,
      }}
    >
      {
        isInWebsite && <Memory cellValue={cellValue} />
      }
      {cellValue?.length && allowedDownload &&
        <BulkDownload files={cellValue} datasheetId={datasheetId} />
      }
    </div>
  );

  return (
    <Modal
      title={t(Strings.list_of_attachments)}
      visible={visible}
      closable
      width={696}
      footer={Footer}
      bodyStyle={{ padding: 0, maxHeight: 464, overflowY: 'auto' }}
      onCancel={closeFn}
      destroyOnClose
      centered
      closeIcon={<CloseMiddleOutlined currentColor />}
      className={styles.uploadModal}
    >
      <div style={{ padding: '0 24px' }}>
        <UploadCore
          recordId={recordId}
          field={field}
          datasheetId={datasheetId}
          cellValue={cellValue}
          columnCount={4}
          rowHeightLevel={rowHeightLevel}
          onSave={onSave}
        />
      </div>
    </Modal>
  );
};
