import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import GoldImg from 'static/icon/workbench/workbench_account_gold_icon.png';
import classNames from 'classnames';

interface IProgress {
  percent: number;
  maxCount: number;
  curCount: number;
}
interface IProgressValue {
  style?: React.CSSProperties;
  className?: string;
  count: number;
}
export const Progress: FC<IProgress> = (props) => {
  const { percent = 0, maxCount = 100, curCount } = props;
  const ProgressValue: FC<IProgressValue> = ({ style, className, count }) =>{
    return (
      <div 
        className={classNames(styles.progressValue, className, styles.valueWrap)} 
        style={{ backgroundImage: `url(${GoldImg})`, ...style }} 
      > 
        <span className={styles.valueText}>{count}</span>
      </div>
    );
  };
  return (
    <div className={styles.progress}>
      <div className={styles.progressBg}>
        <div className={classNames(styles.minValue, styles.valueWrap)} ><span className={styles.valueText}>0</span></div>
        <div className={styles.progressFinished}
          style={{ width: `${percent * 100}%` }} 
        >
          {percent !== 0 && <ProgressValue className={styles.highlight} count={curCount}/>}
        </div>
        <ProgressValue count={maxCount} className={percent === 1 ? styles.highlight: undefined}/>
      </div>
    </div>
  );
};