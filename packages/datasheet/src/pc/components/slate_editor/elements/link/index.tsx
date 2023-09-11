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

import { Input, Tooltip } from 'antd';
import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { Transforms, Element, Range } from 'slate';
import { useSlate, useReadOnly, ReactEditor } from 'slate-react';
import { restoreEditorSelection } from '../../commands';
import Icons from '../../components/icons';
import { ElementType, Z_INDEX } from '../../constant';
import { EditorContext } from '../../context';
import { getValidSelection, getValidUrl } from '../../helpers/utils';
import { IElementRenderProps, ILinkElementData, IElement } from '../../interface/element';

import styles from './link.module.less';

const Link = React.memo(({ element, children, attributes }: IElementRenderProps<IElement<ILinkElementData>>) => {
  const link = element?.data?.link ?? '/';
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(link);
  const { i18nText } = useContext(EditorContext);
  const [press, setPress] = useState(false);

  const editor = useSlate() as ReactEditor;
  const readOnly = useReadOnly();

  const isExpanded = editor.selection && Range.isExpanded(editor.selection);

  const handleVisibleChange = (next: boolean | ((prevState: boolean) => boolean)) => {
    if (isExpanded) return;
    setVisible(next);
    if (next) {
      setValue(link);
    }
  };

  const handleUnlink = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setVisible(false);
      try {
        const path = ReactEditor.findPath(editor, element);
        ReactEditor.focus(editor);
        Transforms.select(editor, getValidSelection(editor));
        Transforms.unwrapNodes(editor, { at: path, match: (n) => Element.isElement(n) && (n as IElement).type === ElementType.LINK });
      } catch (error) {
        console.log(error);
      }
    },
    [editor, element],
  );

  const submit = (linkValue: string, autoClose = false) => {
    const path = ReactEditor.findPath(editor, element);
    const nextData = { ...element.data, link: getValidUrl(linkValue) };
    Transforms.setNodes(editor, { data: nextData } as Partial<IElement>, { at: path });
    if (autoClose) {
      setVisible(false);
      restoreEditorSelection(editor);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    submit(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      submit(value, true);
    }
  };

  const handleVisit = useCallback(() => {
    window.open(link, '_blank');
  }, [link]);

  const handleMouseDown = useCallback(() => {
    setPress(true);
    if (readOnly) {
      handleVisit();
    }
  }, [handleVisit, readOnly]);

  const handleWrapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMove = () => {
    if (readOnly) return;
    if (press && visible) {
      setVisible(false);
    }
  };

  const handleEnd = () => {
    if (readOnly) return;
    setPress(false);
  };

  // const editablePanel = (
  //   <div>
  //     <div className={styles.linkInputGroup}>
  //       {i18nText.text} <br />
  //       <Input size="small" value={text} onChange={handleTextChange} />
  //     </div>
  //     <div className={styles.linkInputGroup}>
  //       {i18nText.link} <br />
  //       <Input size="small" value={value} onChange={handleInputChange} />
  //     </div>
  //     <div className={styles.footer}>
  //       <Button onClick={handleCancel} size="small">{i18nText.cancel}</Button>
  //       <Button onClick={handleOk} size="small" type="primary">{i18nText.ok}</Button>
  //     </div>

  //   </div>
  // );

  const popupPanel = (
    <div className={styles.linkPanel} onClick={handleWrapClick}>
      <div className={styles.linkPanelInline}>
        <Input size="small" value={value} placeholder={i18nText.linkInputPlaceholder} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        {/** If onclick is used, the editor will lose focus and the selection property of the editor will be lost.
         * At this point the node unwrap operation will cause the path of the node to change
         * The pre-saved path of lastSelection conflicts with the path of the node after unwrap.
         * Finding a node based on lastSelection's path will find a non-existent node and cause Slate to throw an error
         */}
        <i className={styles.divider} />
        {/* <Tooltip overlayClassName="editor-tooltip" title={i18nText.ok}>
          <a className={styles.linkOptBtn} onMouseDown={handleOk}>
            <Icons.ok />
          </a>
        </Tooltip> */}
        <Tooltip overlayClassName="editor-tooltip" title={i18nText.visit}>
          <a className={styles.linkOptBtn} onMouseDown={handleVisit}>
            <Icons.link />
          </a>
        </Tooltip>
        <Tooltip overlayClassName="editor-tooltip" title={i18nText.unlink}>
          <a className={styles.linkOptBtn} title={i18nText.unlink} onMouseDown={handleUnlink}>
            <Icons.unlink />
          </a>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <RcTrigger
      popup={popupPanel}
      action={['click']}
      destroyPopupOnHide
      popupAlign={{
        points: ['bc', 'tc'],
        offset: [0, -10],
        overflow: { adjustX: true, adjustY: true },
      }}
      popupStyle={{ width: 300 }}
      popupVisible={!readOnly && visible}
      onPopupVisibleChange={handleVisibleChange}
      zIndex={Z_INDEX.TOOLBAR_LINK_INPUT}
    >
      <a
        {...attributes}
        href={link}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMove}
        onMouseLeave={handleEnd}
        onMouseUp={handleEnd}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </RcTrigger>
  );
});

export default Link;
