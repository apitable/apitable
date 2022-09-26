import { Tooltip, useThemeColors } from '@vikadata/components';
import { ConfigConstant, IAttachmentValue, IField, Selectors } from '@vikadata/core';
import classnames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { DisplayFile } from 'pc/components/display_file';
import { download } from 'pc/components/preview_file/tool_bar';
import * as React from 'react';
import { useSelector } from 'react-redux';
import IconDelete from 'static/icon/common/common_icon_delete.svg';
import IconDownload from 'static/icon/datasheet/datasheet_icon_download.svg';
import styles from './styles.module.less';

interface IPreviewItemProps {
  datasheetId: string;
  name: string;
  id: string;
  cellValue: IAttachmentValue[];
  index: number;
  recordId: string;
  field: IField;
  // 调用者需要综合计算出最终的 readonly 传入，
  // 这里不再额外引入 permissions 来进行权限判断
  readonly?: boolean;
  style?: React.CSSProperties;
  onSave: (cellValue: IAttachmentValue[]) => void;
  setPreviewIndex(index: number): void;
  setPreviewVisible(visible: boolean): void;
}

export const useAllowDownloadAttachment = (fieldId: string, datasheetId?: string): boolean => {
  // 获取是否为只读用户，获取空间站只读用户的下载权限
  const allowDownloadAttachment = useSelector(state => {
    const _allowDownloadAttachment = state.space.spaceFeatures?.allowDownloadAttachment || state.share.allowDownloadAttachment;
    return Boolean(_allowDownloadAttachment);
  });
  const role = useSelector(state => Selectors.getDatasheet(state, datasheetId))?.role;
  const fieldPermissionMap = useSelector(state => Selectors.getFieldPermissionMap(state));
  const fieldRole = useSelector(state => Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId));
  if (allowDownloadAttachment) return true;
  if (!fieldRole) return !(role === ConfigConstant.Role.Reader);
  return fieldRole === ConfigConstant.Role.Editor;
};

export const PreviewItem: React.FC<IPreviewItemProps> = props => {
  const { name, cellValue, id, index, readonly, style, onSave, setPreviewIndex, recordId, field, datasheetId } = props;
  const file = cellValue.find(item => item.id === id);
  const fieldId = field.id;
  const allowDownload = useAllowDownloadAttachment(fieldId, datasheetId);
  const colors = useThemeColors();
  function deleteFile(id: string) {
    return cellValue!.filter(item => item.id !== id);
  }

  function onChange(value: IAttachmentValue[]) {
    if (readonly) {
      return;
    }
    onSave && onSave(value);
  }

  return (
    <div className={classnames(styles.previewItem, 'attachmentPreviewItem')} style={style}>
      <div className={styles.imgWrapper}>
        <DisplayFile
          className={styles.filePreviewInCard}
          index={index}
          fileList={cellValue}
          setPreviewIndex={setPreviewIndex}
          editable={!readonly}
          datasheetId={datasheetId}
          recordId={recordId}
          field={field}
          onSave={onSave}
          disabledDownload={!allowDownload}
        />
      </div>
      <Tooltip content={name} placement="bottom-center">
        <div className={styles.imgName}>{name}</div>
      </Tooltip>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.toolBar}>
          {allowDownload && (
            <div className={styles.iconDownload} onClick={() => download(file!)}>
              <IconDownload fill={colors.black[50]} />
            </div>
          )}
          {!readonly && (
            <div className={styles.iconDelete} onClick={() => onChange(deleteFile(id))}>
              <IconDelete fill={colors.black[50]} />
            </div>
          )}
        </div>
      </ComponentDisplay>
    </div>
  );
};
