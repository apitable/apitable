import { Typography, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import parser from 'html-react-parser';
import Image from 'next/image';
import { FC } from 'react';
import styles from './styles.module.less';

interface IReadingProps {
  [key: string]: any;
}

const size = 160;

export const Reading: FC<IReadingProps> = props => {
  const colors = useThemeColors();
  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <Image
          src={integrateCdnHost(Settings.modal_logout_step1_cover.value)}
          width={size}
          height={size}
        />
      </div>

      <Typography
        variant='h6'
        style={{
          textAlign: 'center',
        }}
      >
        {t(Strings.log_out_reading_h6)}
      </Typography>
      <div className={styles.detail}>
        <Typography
          variant='h8'
          style={{
            margin: '8px 0'
          }}
        >
          {t(Strings.log_out_reading_h8)}
        </Typography>
        <Typography variant='body2' color={colors.fc2}>
          {parser(t(Strings.log_out_user_list))}
        </Typography>
      </div>
    </div>
  );
};
