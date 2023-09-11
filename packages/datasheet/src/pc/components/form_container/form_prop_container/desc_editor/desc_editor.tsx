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

import classNames from 'classnames';
import { get } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { Strings, t } from '@apitable/core';
import SlateEditor from 'pc/components/draft_editor/slate_editor';
import { serialize, transformNodes2Link, removeLinkNodes } from 'pc/components/draft_editor/utils';
import { draft2slate } from 'pc/components/draft_editor/utils/draft_slate';
import { IModeEnum, IBasePropEditorProps } from '../interface';
import styles from './style.module.less';

interface IDescEditorProps extends IBasePropEditorProps {
  descData: any | undefined;
}

export const DescEditor: React.FC<React.PropsWithChildren<IDescEditorProps>> = (props) => {
  const { mode, descData, updateProps } = props;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState();

  const editRef = useRef<any>(null);

  const isEmpty = useMemo(() => {
    if (descData) {
      let formatContent = descData;
      // Compatible with older versions of draftjs format data
      const { content } = descData;
      if (content) {
        formatContent = draft2slate(content);
      }
      if (formatContent.length >= 1 && serialize(formatContent).join('').length >= 1) {
        return false;
      }
      return true;
    }
    return true;
  }, [descData]);

  const onBlur = () => {
    const _content = transformNodes2Link(content as any) as any;
    updateProps({ description: _content });
    setEditing(false);
  };

  if (mode === IModeEnum.Preview && isEmpty) {
    return <></>;
  }

  const contentChangeHandler = (content: React.SetStateAction<undefined>) => {
    // Storage state
    setContent(content);
  };

  return (
    <div
      className={classNames(styles.editorContainer, {
        [styles.hoverClass]: !editing && mode === IModeEnum.Edit,
        [styles.edit]: editing && mode === IModeEnum.Edit,
      })}
      onClick={() => {
        if (mode !== IModeEnum.Edit) return;
        setEditing(true);
        // Manual mouse positioning display
        editRef.current?.focus();
      }}
    >
      <SlateEditor
        syncContent={contentChangeHandler}
        initialValue={mode === IModeEnum.Edit ? removeLinkNodes(draft2slate(get(descData, 'content', descData))) : get(descData, 'content', descData)}
        onBlur={onBlur}
        className={styles.editor}
        placeHolder={t(Strings.form_desc_placeholder)}
        readOnly={!(mode === IModeEnum.Edit)}
        noMention
        ref={editRef}
      />
    </div>
  );
};
