import * as React from 'react';
import styles from './styles.module.less';
import classnames from 'classnames';
import { CheckOutlined } from '@apitable/icons';
import { useThemeColors } from '@apitable/components';

export interface IStepsProps {
  current: number;
  steps: IStepItem[];
  onChange: (current: number) => void;
}

export interface IStepItem {
  title: string;
  onClick?: (item: IStepItem, index: number) => void;
}

export const Steps: React.FC<IStepsProps> = ({ current, steps }) => {
  const colors = useThemeColors();
  const stepItem = (item, index) => {
    const isFinish = current > index;
    return (
      <div key={item.title} className={classnames(
        styles.stepItem,
        current === index && styles.stepItemActive,
        isFinish && styles.stepItemFinish
      )}>
        <div className={styles.stepItemIcon} onClick={() => item?.onClick?.(item, index)}>
          {isFinish ? <CheckOutlined color={colors.defaultBg} size={24}/> : index + 1}
        </div>
        <div className={styles.stepItemContent}>
          <div className={styles.stepItemTitle}>{item.title}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.steps}>
      {steps.map((v, index) => (
        stepItem(v, index)
      ))}
    </div>
  );
};
