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

import { useClickAway } from 'ahooks';
import { Input, Tooltip } from 'antd';
import clx from 'classnames';
import RcTrigger from 'rc-trigger';
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Button } from '@apitable/components';

import { restoreEditorSelection } from '../../../commands';
import { Z_INDEX } from '../../../constant';
import { EditorContext } from '../../../context';
import { getValidUrl } from '../../../helpers/utils';
import { hotkeyMap } from '../../../hotkeys/map';
import { IEventBusEditor } from '../../../interface/editor';
import { BUILT_IN_EVENTS } from '../../../plugins/withEventBus';
import Icons from '../../icons';

import styles from './link_input.module.less';

interface ILinkInputData {
  link: string;
  text: string;
}

interface ILinkInputProps {
  onOK: (data: ILinkInputData) => void;
  defaultLink?: string;
  defaultText?: string;
  disabled?: boolean;
}

const LinkIcon = Icons.link;

export const LinkInput = ({ onOK, defaultLink = '', defaultText = '', disabled = false }: ILinkInputProps) => {
  const editor = useSlate() as ReactEditor & IEventBusEditor;
  const { i18nText } = useContext(EditorContext);
  const [link, setLink] = useState(defaultLink);
  const [text, setText] = useState(defaultText);
  const [visible, setVisible] = useState(false);

  const triggerRef = useRef(null);
  const inlineInputPanelRef = useRef(null);
  const inputPanelRef = useRef(null);

  useClickAway(() => {
    setVisible(false);
  }, [triggerRef, inputPanelRef, inlineInputPanelRef]);

  const handleTextChange = useCallback((e: any) => {
    setText(e.target.value);
  }, []);
  const handleLinkChange = useCallback((e: any) => {
    setLink(e.target.value);
  }, []);

  const handleOk = () => {
    setVisible(false);
    requestAnimationFrame(() => {
      onOK({ link: getValidUrl(link), text: text || defaultText });
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleInputKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOk();
    }
  };

  const handleVisibleChange = useCallback(
    (next: any) => {
      const nextVisible = disabled ? false : next;
      setVisible(nextVisible);
      if (nextVisible) {
        setLink('');
        setText('');
      } else {
        restoreEditorSelection(editor);
      }
    },
    [disabled, editor],
  );

  useEffect(() => {
    const show = () => {
      setVisible(true);
      setLink('');
      setText('');
    };

    editor.on(BUILT_IN_EVENTS.OPEN_LINK_INPUT_PANEL, show);
    return () => {
      editor.off(BUILT_IN_EVENTS.OPEN_LINK_INPUT_PANEL, show);
    };
  }, [editor]);

  const TriggerElement = (
    <Tooltip
      overlayClassName="editor-tooltip"
      title={
        <span>
          {i18nText.link}
          <br />
          {hotkeyMap.link.platform}
        </span>
      }
    >
      <div className={styles.trigger} data-disabled={disabled} data-active={visible} ref={triggerRef}>
        <LinkIcon />
      </div>
    </Tooltip>
  );

  const InputPanel = (
    <div className={styles.linkInputPanel} ref={inputPanelRef}>
      <div className={styles.inputGroup}>
        {i18nText.text} <br />
        <Input size="small" autoFocus value={text} onChange={handleTextChange} />
      </div>
      <div className={styles.inputGroup}>
        {i18nText.link} <br />
        <Input size="small" value={link} onChange={handleLinkChange} onKeyDown={handleInputKeydown} />
      </div>
      <div className={styles.footer}>
        <Button onClick={handleCancel} size="small">
          {i18nText.cancel}
        </Button>
        <Button onClick={handleOk} size="small" color="primary">
          {i18nText.ok}
        </Button>
      </div>
    </div>
  );

  const InputPanelInline = (
    <div className={clx(styles.linkInputPanelInline, styles.linkInputPanel)} ref={inlineInputPanelRef}>
      <Input autoFocus placeholder={i18nText.linkInputPlaceholder} value={link} onKeyDown={handleInputKeydown} onChange={handleLinkChange} />
      <Button onClick={handleOk} color="primary" size="small">
        {i18nText.ok}
      </Button>
    </div>
  );

  return (
    <RcTrigger
      popup={defaultText ? InputPanelInline : InputPanel}
      action={['click']}
      destroyPopupOnHide
      popupAlign={{
        points: ['tc', 'bc'],
        offset: [0, 10],
        overflow: { adjustX: true, adjustY: true },
      }}
      popupStyle={{ width: 300 }}
      popupVisible={visible}
      onPopupVisibleChange={handleVisibleChange}
      zIndex={Z_INDEX.TOOLBAR_LINK_INPUT}
    >
      {TriggerElement}
    </RcTrigger>
  );
};
