import { CopyOutlined, DeleteOutlined } from '@vikadata/icons';

import { Tooltip } from 'antd';
import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Node, Transforms } from 'slate';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';
import { EditorContext } from '../../context';
// 暂时隐藏代码高亮功能
// import { languages } from '../../plugins/codeBlock';
// import { Select } from '../../components/select';
// import { Z_INDEX } from '../../constant';
// import { updateElementData } from '../../commands';
import { copy } from '../../helpers/copy';
import { ICodeBlockWrapElementData, IElement, IElementRenderProps } from '../../interface/element';

import styles from './code.module.less';

enum Result {
  Success,
  Error,
  Empty,
}

export const CodeBlockWrap = ({ children, element }: IElementRenderProps<IElement<ICodeBlockWrapElementData>>) => {
  // const curLanguage = useMemo(() => {
  //   if (!element.data || !element.data.lang) {
  //     return languages[0].value;
  //   }
  //   return element.data.lang;
  // }, [element.data]);

  const readOnly = useReadOnly();
  const editor = useSlate() as ReactEditor;
  const { i18nText } = useContext(EditorContext);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [copyResult, setCopyResult] = useState(Result.Empty);

  const handleMouseEnter = useCallback(() => {
    setToolbarVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setToolbarVisible(false);
  }, []);

  // const handleLanguageChange = useCallback((next) => {
  //   const path = ReactEditor.findPath(editor, element);
  //   updateElementData(editor, { lang: next }, path, false);
  // }, [editor, element]);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const text = Node.string(element);
    copy(text, JSON.stringify(element))
      .then(() => {
        setCopyResult(Result.Success);
      })
      .catch(() => {
        setCopyResult(Result.Error);
      })
      .finally(() => {
        window.setTimeout(() => {
          setCopyResult(Result.Empty);
        }, 1000);
      });
  }, [element]);

  const handleDelete = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
  }, [element, editor]);

  // const LanguageSelect = !readOnly && <Select
  //   options={languages}
  //   onChange={handleLanguageChange}
  //   value={curLanguage}
  //   zIndex={Z_INDEX.TOOLBAR_SELECT}
  //   selectedSignVisible={false}
  //   width={120}
  //   className={styles.languageSelect}
  // />;

  const resultTip = useMemo(() => {
    const arr = [
      <span key={i18nText.copySuccess}>{i18nText.copySuccess}</span>,
      <span key={i18nText.copyFailed}>{i18nText.copyFailed}</span>,
      null
    ];
    return arr[copyResult];
  }, [copyResult, i18nText]);

  return <pre className={styles.codeWrap} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
    {toolbarVisible && <div className={styles.codeWrapToolbar} contentEditable={false}>
      {/* {LanguageSelect} */}
      { !readOnly && <Tooltip
        overlayClassName="editor-tooltip"
        title={i18nText.delete}
        placement="top"
      >
        <span style={{ display: 'inline-flex' }} onMouseDown={handleDelete}>
          <DeleteOutlined className={styles.operationBtn} />
        </span>
      </Tooltip>
      }
      <Tooltip
        overlayClassName="editor-tooltip"
        title={resultTip}
        placement="top"
        visible={copyResult !== Result.Empty}
      >
        <span style={{ display: 'inline-flex' }} onMouseDown={handleCopy}>
          <CopyOutlined className={styles.operationBtn} />
        </span>
      </Tooltip>
    </div>
    }
    {children}
  </pre>;
};
