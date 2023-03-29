import { DatasheetApi, IDatasheetState, ICascaderField, t, Strings } from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Typography, LinkButton, RadioGroup } from '@apitable/components';
import styles from './styles.module.less';

interface ICascaderSnapshotUpdateModal {
  setShowSnapshotModal: Dispatch<SetStateAction<boolean>>;
  linkedDatasheet?: IDatasheetState | null;
  updateField: () => void;
  spaceId: string;
  datasheetId: string;
  field: ICascaderField;
}

export enum CascaderSnapshotStatus {
  Update = 'update',
  Retain = 'retain'
}

export const CascaderSnapshotUpdateModal = (props: ICascaderSnapshotUpdateModal) => {
  const { setShowSnapshotModal, linkedDatasheet, updateField, spaceId, datasheetId, field } = props;
  const [status, setStatus] = useState<CascaderSnapshotStatus>(CascaderSnapshotStatus.Retain);
  const handleChange = (_e: ChangeEvent, value: CascaderSnapshotStatus) => {
    setStatus(value);
  };
  const handleOk = () => {
    if (status === CascaderSnapshotStatus.Update) {
      DatasheetApi.updateCascaderSnapshot({
        spaceId,
        datasheetId,
        fieldId: field.id,
        linkedDatasheetId: field.property.linkedDatasheetId,
        linkedViewId: field.property.linkedViewId,
      });
    }
    setShowSnapshotModal(false);
    updateField();
  };
  return (
    <Modal
      open
      destroyOnClose
      maskClosable={false}
      closable={false}
      title={t(Strings.please_note)}
      onCancel={() => setShowSnapshotModal(false)}
      onOk={handleOk}
      className={styles.cascaderSnapshotModal}
      width={400}
    >
      <p>{t(Strings.cascader_snapshot_update_text)}</p>
      <Typography variant="h7" className={styles.cascaderSnapshotModalText}>
        {t(Strings.cascader_data_source)}
        <LinkButton href={`/workbench/${linkedDatasheet?.id}`}>
          {linkedDatasheet?.name}
        </LinkButton>
      </Typography>
      <div className={styles.cascaderSnapshotModalRadio}>
        <RadioGroup
          name="cascader-snashot-update"
          value={status}
          onChange={handleChange}
          options={[
            {
              label: t(Strings.cascader_old_snapshot_data),
              value: CascaderSnapshotStatus.Retain
            },
            {
              label: t(Strings.cascader_linked_datasheet_data),
              value: CascaderSnapshotStatus.Update
            }
          ]}
        />
      </div>
    </Modal>
  );
};