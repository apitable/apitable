import { IconButton } from '@apitable/components';
import { useMount } from 'ahooks';
import { CloseMiddleOutlined } from '@apitable/icons';
import { FC, useState } from 'react';
import styles from './style.module.less';
import { CSSTransition } from 'react-transition-group';

interface IProps {
  width?: number | string;
  onClose?: () => void;
}

export const Modal: FC<IProps> = (props) => {
  const { width, children, onClose } = props;

  const [inProp, setInProps] = useState(false);
  useMount(() => {
    setInProps(true);
  });

  return (
    <div className={styles.modelRoot}>
      <CSSTransition
        in={inProp}
        timeout={300}
        classNames='notice-animation'
      >
        <div className={styles.content} style={{ width }}>
          <div className={styles.closeBtnWrap} >
            <IconButton
              className={styles.closeBtn}
              shape='square'
              icon={CloseMiddleOutlined}
              onClick={ () => { onClose && onClose(); } }
            />
          </div>
          { children }
        </div>
      </CSSTransition>
    </div>
  );
};
