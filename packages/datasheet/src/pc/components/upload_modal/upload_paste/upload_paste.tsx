import { resourceService } from 'pc/resource_service';
import { useThemeColors } from '@vikadata/components';

import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import * as React from 'react';
import IconPaste from 'static/icon/datasheet/datasheet_icon_pasteattachment.svg';
import { ICommonTabRef } from '../upload_tab';
import styles from './styles.module.less';
import { IUploadZoneItem } from 'pc/components/upload_modal/upload_zone';
import { isImage, Strings, t, IAttachmentValue } from '@vikadata/core';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { ShortcutActionName } from 'pc/common/shortcut_key';

interface IUploadPasteBaseProps {
  recordId: string;
  fieldId: string;
  cellValue: IAttachmentValue[];
  onUpload (files: IUploadZoneItem[]): void;
}

export const UploadPasteBase: ForwardRefRenderFunction<ICommonTabRef, IUploadPasteBaseProps> = (props, ref) => {
  const { recordId, fieldId, cellValue, onUpload } = props;
  const colors = useThemeColors();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tip, setTip] = useState(t(Strings.click_upload_tip));

  useImperativeHandle<ICommonTabRef, ICommonTabRef>(
    ref,
    () => ({
      focus() {
        setTimeout(() => {
          setActiveTip();
        }, 0);
        return;
      },
    }),
  );

  function setActiveTip() {
    inputRef.current?.focus();
    setTip(
      t(Strings.paste_attachment, {
        keyboardShortcut: getShortcutKeyString(ShortcutActionName.Paste),
      })
    );
  }

  function onPaste(e: React.ClipboardEvent) {
    const clipboardData = e.nativeEvent.clipboardData;

    if (!clipboardData) { return; }

    const files = Array.from(clipboardData.files).filter(item => {
      return isImage(item);
    });

    if (!files.length) { return; }

    onUpload(resourceService.instance!.uploadManager.buildStdUploadList(files, recordId, fieldId, cellValue));
  }

  return (
    <div
      className={styles.uploadPaste}
      onFocus={setActiveTip}
      tabIndex={1}
    >
      <input
        tabIndex={-1}
        onPaste={onPaste}
        onBlur={() => { setTip(t(Strings.click_upload_tip)); }}
        ref={inputRef}
      />
      <IconPaste fill={colors.fourthLevelText} />
      {tip}
    </div >
  );
};

export const UploadPaste = forwardRef<ICommonTabRef, IUploadPasteBaseProps>(UploadPasteBase);
