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

import { Tooltip, useThemeColors } from '@apitable/components';
import { ConfigConstant, IAttachmentValue, IAttacheField, Selectors } from '@apitable/core';
import { DeleteOutlined, DownloadOutlined } from '@apitable/icons';
import classnames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { DisplayFile } from 'pc/components/display_file';
import { download } from 'pc/components/preview_file/tool_bar';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.less';

interface IPreviewItemProps {
  datasheetId: string;
  name: string;
  id: string;
  cellValue: IAttachmentValue[];
  index: number;
  recordId: string;
  field: IAttacheField;
  // The caller needs to synthesize the final readonly incoming,
  // no additional 'permissions' are introduced here to determine permissions
  readonly?: boolean;
  style?: React.CSSProperties;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  setPreviewIndex?: (index: number) => void;
  setPreviewVisible?: (visible: boolean) => void;
}

export const useAllowDownloadAttachment = (fieldId: string, datasheetId?: string): boolean => {
  // Get whether it is read-only user and get download permission for read-only user of space station.
  const allowDownloadAttachment = useSelector(state => {
    const _allowDownloadAttachment = state.space.spaceFeatures?.allowDownloadAttachment || state.share.allowDownloadAttachment;
    return Boolean(_allowDownloadAttachment);
  });
  const role = useSelector(state => Selectors.getDatasheet(state, datasheetId))?.role;
  const fieldPermissionMap = useSelector(state => Selectors.getFieldPermissionMap(state));
  const fieldRole = useSelector(() => Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId));
  if (allowDownloadAttachment) return true;
  if (!fieldRole) return !(role === ConfigConstant.Role.Reader);
  return fieldRole === ConfigConstant.Role.Editor;
};

export const PreviewItem: React.FC<React.PropsWithChildren<IPreviewItemProps>> = props => {
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
              <DownloadOutlined color={colors.black[50]} />
            </div>
          )}
          {!readonly && (
            <div className={styles.iconDelete} onClick={() => onChange(deleteFile(id))}>
              <DeleteOutlined color={colors.black[50]} />
            </div>
          )}
        </div>
      </ComponentDisplay>
    </div>
  );
};
