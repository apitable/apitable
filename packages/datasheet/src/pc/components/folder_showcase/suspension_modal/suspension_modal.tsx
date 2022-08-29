import { FC, useState, useRef } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.less';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import { useThemeColors } from '@vikadata/components';
import { useClickAway } from 'ahooks';

export interface ISuspensionModalProps {
  content?: React.ReactNode;
  align?: {
    x: number;
    y: number;
  };
}

export const SuspensionModal: FC<ISuspensionModalProps> = props => {
  const { align = { x: 0, y: 8 }, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>();
  const [modalPos, setModalPos] = useState<{ top?: number, bottom?: number, left?: number, right?: number }>({});

  const handleClick = e => {
    if (!ref.current) { return; }
    setVisible(!visible);
    const domRect = ref.current.getBoundingClientRect();
    setModalPos({ top: domRect.bottom + align.y, right: document.body.clientWidth - domRect.right + align.x });
  };

  return (
    <>
      {React.cloneElement(props.children as React.ReactElement,
        { ref, onClick: handleClick },
      )}
      {visible && <Modal {...rest} style={modalPos} onClose={setVisible} />}
    </>
  );
};

const Modal = props => {
  const { onClose, ...rest } = props;
  const children = React.cloneElement(props.content, {
    closeModal: () => handleClose(),
  });
  const colors = useThemeColors();
  const ref = useRef(null);

  useClickAway(() => {
    onClose(false);
  }, ref);

  const handleClose = () => {
    onClose(false);
  };

  return ReactDOM.createPortal(
    (
      <div className={styles.suspensionModal} {...rest} ref={ref}>
        <div className={styles.closeBtn}>
          <CloseIcon width={24} height={24} fill={colors.thirdLevelText} onClick={handleClose} />
        </div>
        {children}
      </div>
    ),
    window.document.body,
  );
};
