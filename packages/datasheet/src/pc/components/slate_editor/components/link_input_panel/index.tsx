import { useRef, useEffect, useCallback, useContext, useState } from 'react';
import * as React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { getValidSelection, getValidPopupPosition } from '../../helpers/utils';
import { Portal } from 'pc/components/portal';
import { Z_INDEX } from '../../constant';
import { IEventBusEditor } from '../../interface/editor';
import { BUILT_IN_EVENTS } from '../../plugins/withEventBus';
import { useToggle, useClickAway, useDebounceFn } from 'ahooks';
import clx from 'classnames';
import { Input } from 'antd';
import { Button } from '@vikadata/components';
import { EditorContext } from '../../context';
import { getValidUrl } from '../../helpers/utils';
import {
  wrapLink,
  insertLink,
} from '../../commands';

import styles from './style.module.less';

export const LinkInputPanel = () => {

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlate() as ReactEditor & IEventBusEditor;
  const timer = useRef<number | null>(null);
  const [visible, { set: setVisible }] = useToggle();
  const { i18nText } = useContext(EditorContext);
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const curSelectedText = Editor.string(editor, getValidSelection(editor));

  const inlineInputRef = useRef<Input>(null);

  const hide = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    setVisible(false);
    setLink('');
    setText('');
    const el = wrapRef.current;
    if (el) {
      el.removeAttribute('data-visible');
    }
  }, [setVisible]);

  const show = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      timer.current = null;
      if (inlineInputRef.current) {
        inlineInputRef.current.focus();
      }
      setVisible(true);
    }, 300);
  }, [setVisible]);

  useClickAway(() => { }, wrapRef);

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
  }, []);
  const handleLinkChange = useCallback((e) => {
    setLink(e.target.value);
  }, []);

  const handleInsertLinkNode = (data) => {
    const validSelection = getValidSelection(editor);
    ReactEditor.focus(editor);
    Transforms.select(editor, validSelection);
    if (curSelectedText) {
      wrapLink(editor, data.link);
    } else {
      insertLink(editor, data.link, data.text);
    }
  };

  const handleOk = () => {
    if (!curSelectedText && !text) {
      return ;
    }
    hide();
    requestAnimationFrame(() => {
      handleInsertLinkNode({ link: getValidUrl(link), text: text || curSelectedText });
    });
  };

  const handleCancel = () => {
    hide();
  };

  const handleInputKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOk();
    }
  };

  const { run: changePosition } = useDebounceFn(
    () => {
      const el = wrapRef.current;
      const selection = getValidSelection(editor);
      if (!el || !selection) {
        return;
      }
      try {
        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rect = domRange.getBoundingClientRect();
        if (!rect) {
          return;
        }
        // const popupRect = el.getBoundingClientRect();
        const position = getValidPopupPosition({
          anchor: rect,
          popup: el.getBoundingClientRect(),
          offset: { x: 0, y: 5 },
          align: ['center', 'bottom']
        });
        el.style.top = `${position.top}px`;
        el.style.left = `${position.left}px`;
      } catch (error) {
        console.log(error);
      }
    },
    {
      wait: 300
    }
  );

  const handleWrapMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    changePosition();
  });

  useEffect(() => {
    editor.on(BUILT_IN_EVENTS.EDITOR_SCROLL, hide);
    editor.on(BUILT_IN_EVENTS.OPEN_LINK_INPUT_PANEL, show);
    return () => {
      editor.off(BUILT_IN_EVENTS.EDITOR_SCROLL, hide);
      editor.off(BUILT_IN_EVENTS.OPEN_LINK_INPUT_PANEL, show);
    };
  }, [editor, hide, show]);

  const InputPanel = (
    <div className={styles.linkInputPanel}>
      <div className={styles.inputGroup}>
        {i18nText.text}
        <Input value={text} onChange={handleTextChange} />
      </div>
      <div className={styles.inputGroup}>
        {i18nText.link}
        <Input value={link} onChange={handleLinkChange} onKeyDown={handleInputKeydown} />
      </div>
      <div className={styles.footer}>
        <Button onClick={handleCancel} >{i18nText.cancel}</Button>
        <Button onClick={handleOk} color="primary">{i18nText.ok}</Button>
      </div>
    </div>
  );

  const InputPanelInline = (
    <div className={clx(styles.linkInputPanelInline, styles.linkInputPanel)}>
      <Input
        ref={inlineInputRef}
        placeholder={i18nText.linkInputPlaceholder}
        value={link}
        onKeyDown={handleInputKeydown}
        onChange={handleLinkChange} />
      <Button onClick={handleOk} color="primary">{i18nText.ok}</Button>
    </div>
  );

  return <Portal zIndex={Z_INDEX.HOVERING_TOOLBAR}>
    <div className={styles.wrap} data-visible={visible} onMouseDown={handleWrapMouseDown} ref={wrapRef}>
      {
        curSelectedText ?
          InputPanelInline :
          InputPanel
      }
    </div>
  </Portal>;
};
