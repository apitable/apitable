import { useRef, useState, FC } from 'react';
import styles from './style.module.less';
import { motion } from 'framer-motion';
import classNames from 'classnames';

interface ITouchMove {
  id: string;
  initPosition: {
    left: string;
    top: string;
  };
  sessionStorageKey: string;
  onResize?: () => void;
  onClick?: (e: any) => void; // 单击事件回调
  onDragStart?: () => void;
}

export const TouchMove: FC<ITouchMove> = (props) => {
  const constraintsRef = useRef(document.body);
  const [stopClick, setStopClick]= useState(false);
  const onDragStart = e => {
    setStopClick(true);
    props.onDragStart && props.onDragStart();
  };
  const onDragEnd = e => {
  };
  const onMouseDown = e => {
    setStopClick(false);
  };

  const onClick = e => {
    if(stopClick) return;
    props.onClick && props.onClick(e);
  };
  return (
    <motion.div
      className={classNames(styles.touchMove)}
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      id={props.id}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      { props.children }
    </motion.div>
  );
};
