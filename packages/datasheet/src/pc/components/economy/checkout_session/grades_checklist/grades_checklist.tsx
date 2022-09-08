import { Typography } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import * as React from 'react';
import { FC, useState } from 'react';
import { LevelOperation, LevelPrice } from '../../stateless_ui';
import styles from './style.module.less';

const getSpaceLevelInfo = () => {
  const data = JSON.parse(t(Strings.subscription_grades_checklist));
  return data.reduce((last, item) => {
    if(last[item.group]){
      last[item.group].push(item);
    }else{
      last[item.group]=[item];
    }
    return last;
  },{});
};
const InfoList: FC<{ valueKey: 'title' | 'bronze' | 'silver' | 'enterprise' }> = ({ valueKey }): React.ReactElement => {
  const spaceLevelInfo = getSpaceLevelInfo();
  return (
    <div>
      {
        Object.keys(spaceLevelInfo).map(key => (
          <div key={key}>
            <Typography variant="h6" className={styles.groupName}>{valueKey === 'title' && key}</Typography>
            {
              spaceLevelInfo[key].map(data => (
                <Typography variant="body2" className={styles.groupValue}>{data[valueKey]}</Typography>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export const GradesChecklist = () => {
  // 0-default，能看见button；1-不能看见
  const [buttonVisible, setButtonVisible] = useState(true);
  const onScroll = (e => {
    if (typeof e.target.scrollTop !== 'number') return;
    if (e.target.scrollTop > 260 && buttonVisible) {
      setButtonVisible(false);
    } else if (e.target.scrollTop < 260 && !buttonVisible) {
      setButtonVisible(true);
    }
  });

  return (
    <div className={classNames(styles.levelCompare, { [styles.buttonHidden]: !buttonVisible })} onScroll={onScroll}>
      <div className={classNames(styles.scrollContent)}>
        <ul className={styles.content}>
          <li>
            <div className={styles.levelName} />
            <LevelPrice title="" />
            <InfoList valueKey="title"/>
          </li>
          <li>
            <div className={styles.levelName}>
              {SpaceLevelInfo.bronze.spaceLevelTag.logo}
              <Typography variant="h3" className={styles.text}>{SpaceLevelInfo.bronze.title}</Typography>
            </div>
            <LevelPrice title="0" sup="¥" sub="/月" />
            <LevelOperation type="free" className={styles.levelOperationWrapper}/>
            <InfoList valueKey="bronze" />
          </li>
          <li>
            <div className={styles.levelName}>
              {SpaceLevelInfo.silver.spaceLevelTag.logo}
              <Typography variant="h3" className={styles.text}>{SpaceLevelInfo.silver.title}</Typography>
            </div>
            <LevelPrice title="30" sup="¥" sub="/月" />
            <LevelOperation type="upgradeSeats" className={styles.levelOperationWrapper}/>
            <InfoList valueKey="silver"/>
          </li>
          <li>
            <div className={styles.levelName}>
              {SpaceLevelInfo.enterprise.spaceLevelTag.logo}
              <Typography variant="h3" className={styles.text}>{SpaceLevelInfo.enterprise.title}</Typography>
            </div>
            <LevelPrice title="按需定制" />
            <LevelOperation type="customerService" className={styles.levelOperationWrapper}/>
            <InfoList valueKey="enterprise"/>
          </li>
        </ul>
      </div>
      <div className={styles.footer}>
        <ul>
          <li />
          <li><LevelOperation type="free"/></li>
          <li>
            <LevelOperation type="upgradeSeats"/>
          </li>
          <li>
            <LevelOperation type="customerService"/>
          </li>
        </ul>
      </div>
    </div>
  );
};
