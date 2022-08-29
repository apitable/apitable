import { Button } from '@vikadata/components';
import classNames from 'classnames';
import Image from 'next/image';
import { Wrapper } from 'pc/components/common';
import DefaultImg from 'static/icon/common/common_img_feishu_binding.png';
import styles from './style.module.less';

export interface IErrPromptBase {
  headerLogo?: string;
  title?: string;
  img?: React.ReactNode;
  desc: string;
  btnText: string;
  onClick: () => void;
}

export const ErrPromptBase = (data: IErrPromptBase) => {
  const { img = DefaultImg, desc, btnText, onClick, headerLogo, title } = data;
  return (
    <Wrapper hiddenLogo className="center">
      <div
        className={classNames(
          'commonWrapper',
          'center',
          styles.errPromptBase,
          title && styles.errPromptBaseHasTitle
        )}
      >
        <div className="commonImgWrapper">
          {headerLogo && <Image src={headerLogo} />}
        </div>
        <span className={styles.mainImg}>
          <Image src={img as string} />
        </span>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.desc}>{desc}</div>
        <Button color="primary" onClick={onClick}>
          {btnText}
        </Button>
      </div>
    </Wrapper>
  );
};

