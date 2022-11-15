import { useMount } from 'ahooks';
import QRCode from 'qrcode';
import { FC } from 'react';
import styles from './style.module.less';
import { Message } from '@apitable/components';
import classNames from 'classnames';

type IQrCodeAreaProps = {
  className?: string
  img?: string
  url?: string
};

export const QrCodeArea: FC<IQrCodeAreaProps> = (props) => {
  useMount(() => {
    if (!props.url) return;
    QRCode.toCanvas(props.url,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'Generate QrCode failed' });
        }
        const container = document.getElementById('shareQrCode');
        container?.appendChild(canvas);
      });
  });

  return (
    <div className={classNames(styles.box, props.className)}>
      <div className={styles.corner} />
      <div className={styles.corner} />
      <div className={styles.corner} />
      <div className={styles.corner} />
      {props.img && <img src={props.img} />}
      <div id="shareQrCode" />
    </div>
  );
};
