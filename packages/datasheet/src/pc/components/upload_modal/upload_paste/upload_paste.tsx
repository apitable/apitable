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

import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef, useState } from 'react';

import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { isImage, Strings, t, IAttachmentValue } from '@apitable/core';
import { CopyOutlined } from '@apitable/icons';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { IUploadZoneItem } from 'pc/components/upload_modal/upload_zone';
import { resourceService } from 'pc/resource_service';
import { ICommonTabRef } from '../upload_tab';
import styles from './styles.module.less';

interface IUploadPasteBaseProps {
  recordId: string;
  fieldId: string;
  cellValue: IAttachmentValue[];
  onUpload(files: IUploadZoneItem[]): void;
}

export const UploadPasteBase: ForwardRefRenderFunction<ICommonTabRef, IUploadPasteBaseProps> = (props, ref) => {
  const { recordId, fieldId, cellValue, onUpload } = props;
  const colors = useThemeColors();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tip, setTip] = useState(t(Strings.click_upload_tip));

  useImperativeHandle<ICommonTabRef, ICommonTabRef>(ref, () => ({
    focus() {
      setTimeout(() => {
        setActiveTip();
      }, 0);
      return;
    },
  }));

  function setActiveTip() {
    inputRef.current?.focus();
    setTip(
      t(Strings.paste_attachment, {
        keyboardShortcut: getShortcutKeyString(ShortcutActionName.Paste),
      }),
    );
  }

  function onPaste(e: React.ClipboardEvent) {
    const clipboardData = e.nativeEvent.clipboardData;

    if (!clipboardData) {
      return;
    }

    const files = Array.from(clipboardData.files).filter((item) => {
      return isImage(item);
    });

    if (!files.length) {
      return;
    }

    onUpload(resourceService.instance!.uploadManager.buildStdUploadList(files, recordId, fieldId, cellValue));
  }

  return (
    <div className={styles.uploadPaste} onFocus={setActiveTip} tabIndex={1}>
      <input
        tabIndex={-1}
        onPaste={onPaste}
        onBlur={() => {
          setTip(t(Strings.click_upload_tip));
        }}
        ref={inputRef}
      />
      <CopyOutlined color={colors.fourthLevelText} />
      {tip}
    </div>
  );
};

export const UploadPaste = forwardRef<ICommonTabRef, IUploadPasteBaseProps>(UploadPasteBase);
