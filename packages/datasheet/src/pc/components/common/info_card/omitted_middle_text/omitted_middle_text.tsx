import styles from './style.module.less';
import { FC } from 'react';

export const OmittedMiddleText: FC<{ text: string }> = (props) => {
  const { text } = props;

  return (
    <div className={styles.desc}>
      <span className={styles.descriptionChild1}>{text}</span>
      <span className={styles.descriptionChild2} title={text}>{text}</span>
    </div>
  );
};