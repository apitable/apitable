import { CheckOutlined } from '@vikadata/icons';
import { FC } from 'react';
import styles from './style.module.less';

interface IProps {
  percent?: number,
  strokeWidth?: number, // Line thickness
  strokeColor: string, // Line colour
}

export const ProcessBar: FC<IProps> = (props) => {
  const { percent = 0, strokeWidth = 8, strokeColor } = props;
  return (
    <div className={styles.progressBar}>
      <div
        className={styles.foregroundColor}
        style={{ 
          height: strokeWidth,
          width: percent + '%',
          backgroundColor: strokeColor,
        }}
      />
      { 
        ![0, 100].includes(percent) && 
        <div className={styles.icon} style={{
          left: percent + '%',
          transform: `translate(-${11}px, -${11 - strokeWidth / 2}px)`
        }}>
          <div style={{ transform: 'scale(1.1)' }}>
            <CheckOutlined size={19} />
          </div>
        </div>
      }
    </div>
  );
};
