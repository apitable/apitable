import { IAttachmentValue } from '@vikadata/core';
import classNames from 'classnames';
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';
import styles from './style.module.less';

interface IItemProps {
  index: number;
  active: boolean;
  setActiveIndex(index: number): void;
  file: IAttachmentValue;
  imgSrc: string;
}

export const Item: FC<IItemProps> = props => {

  const {
    index,
    active,
    setActiveIndex,
    file,
    imgSrc,
  } = props;

  const activeEleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      activeEleRef.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [active]);

  return (
    <div
      tabIndex={-1}
      className={
        classNames({
          [styles.active]: active,
          [styles.item]: true,
          [styles.imgWrapper]: true,
        })
      }
      onClick={() => setActiveIndex(index)}
      ref={activeEleRef}
    >
      <Image
        src={imgSrc}
        alt={file.name}
        width={40}
        height={40}
      />
    </div>
  );
};
