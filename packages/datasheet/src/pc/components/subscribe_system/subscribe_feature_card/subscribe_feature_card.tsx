import { Button, Typography, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import { CheckOutlined, ShareStarFilled } from '@vikadata/icons';
import { ILevelInfo } from 'pc/components/subscribe_system/config';
import styles from 'pc/components/subscribe_system/styles.module.less';
import * as React from 'react';

interface ISubscribeFeatureCardProps {
  levelInfo: ILevelInfo;
}

export const SubscribeFeatureCard: React.FC<ISubscribeFeatureCardProps> = (props) => {
  const { levelInfo } = props;
  const colors = useThemeColors();

  return <div className={styles.rightFeatureList} style={{ background: levelInfo.rightFeatureListBg }}>
    <p className={styles.header}>
      <ShareStarFilled color={levelInfo.activeColor} />
      <Typography variant={'body2'} className={styles.text}>
        {levelInfo.levelPowerTitle}
      </Typography>
    </p>
    {
      levelInfo.levelDesc.map(item => {
        return <p className={styles.item}>
          <CheckOutlined color={levelInfo.activeColor} />
          <Typography variant={'body3'} color={colors.fc2} className={styles.text}>
            {item}
          </Typography>
        </p>;
      })
    }
    <Button
      color={colors.defaultBg}
      block
      className={styles.featureButton}
      onClick={() => {
        window.open('/pricing', '_blank', 'noopener,noreferrer');
      }}
    >
      <Typography variant={'body2'} color={colors.fc2}>
        {t(Strings.plan_model_benefits_button)}
      </Typography>
    </Button>
  </div>;
};
