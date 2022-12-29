import * as React from 'react';
import Highlighter from 'react-highlight-words';
import styles from './style.module.less';

export interface IHighlightWords {
  keyword?: string;
  words: string;
}

export const HighlightWords:React.FC<IHighlightWords> = (props) => {
  const { keyword, words } = props;
  if (!keyword) {
    return <>{words}</>;
  }
  return (
    <Highlighter
      highlightClassName={styles.hightLight}
      searchWords={[keyword]}
      autoEscape
      textToHighlight={words}
    />
  );
};