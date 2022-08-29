import { Avatar, Typography, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import Image from 'next/image';
import { ILevelInfo, paySystemConfig, SubscribePageType } from 'pc/components/subscribe_system/config';
import styles from 'pc/components/subscribe_system/styles.module.less';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export enum SubscribeLevelTab {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  ENTERPRISE = 'ENTERPRISE',
  UNUSED = 'UNUSED'
}

interface ISubscribeHeaderProps {
  levelTab: SubscribeLevelTab;
  setLevelTab: React.Dispatch<React.SetStateAction<SubscribeLevelTab>>;
  levelInfo: ILevelInfo;
  pageType: SubscribePageType;
}

const calcSubscribeLevelTab = (seats: number) => {
  if (seats <= 80) {
    return 'SILVER';
  }
  if (seats <= 200) {
    return 'GOLD';
  }
  return 'ENTERPRISE';
};

const calcUpgradeLevelTab = (product: string | undefined, maxSeats: number, setTabs: React.Dispatch<any>) => {
  if (product === 'SILVER') {
    if (maxSeats >= 80) {
      setTabs(pre => {
        return pre.filter(item => {
          return item.level !== 'SILVER';
        });
      });
      return 'GOLD';
    }
    return 'SILVER';
  }

  if (product === 'GOLD') {
    if (maxSeats >= 200) {
      setTabs(pre => {
        return pre.filter(item => {
          return item.level === 'ENTERPRISE';
        });
      });
      return 'ENTERPRISE';
    }
    setTabs(pre => {
      return pre.filter(item => {
        return item.level !== 'SILVER';
      });
    });
    return 'GOLD';
  }

  return 'ENTERPRISE';
};

export const SubscribeHeader: React.FC<ISubscribeHeaderProps> = (props) => {
  const { levelTab, setLevelTab, levelInfo, pageType } = props;
  const [recommend, setRecommend] = useState<SubscribeLevelTab>();
  const space = useSelector(state => state.space);
  const colors = useThemeColors();
  const spaceInfo = space.curSpaceInfo;
  const subscription = useSelector(state => state.billing.subscription);
  const isRenewal = pageType === SubscribePageType.Renewal;
  const [tabs, setTabs] = useState(Object.values(paySystemConfig));

  useEffect(() => {
    if (!spaceInfo || !subscription) {
      return;
    }
    const seats = Number(spaceInfo?.seats);

    const level = (() => {
      if (pageType === SubscribePageType.Subscribe) {
        return calcSubscribeLevelTab(seats);
      }
      if (pageType === SubscribePageType.Renewal) {
        return subscription!.product.toUpperCase();
      }
      return calcUpgradeLevelTab(subscription?.product.toUpperCase(), subscription.maxSeats, setTabs);
    })();

    setLevelTab(level as SubscribeLevelTab);
    pageType !== SubscribePageType.Renewal && setRecommend(level as SubscribeLevelTab);
  }, [spaceInfo, setLevelTab, subscription, pageType]);

  return <header style={{ background: `center / cover url(${levelInfo.headBgSrc})` }}>
    <Image src={levelInfo.headBgSrc as string} layout={'fill'} objectFit={'cover'} />
    <Avatar size={'m'} shape="square" src={spaceInfo?.spaceLogo ? spaceInfo?.spaceLogo : undefined} style={{ background: '#7B67EE' }}>
      {spaceInfo?.spaceName[0]}
    </Avatar>
    {
      <div className={styles.spaceName}>
        <Typography variant={'h5'} color={levelTab === SubscribeLevelTab.GOLD ? colors.staticDark1 : 'white'}>
          {spaceInfo?.spaceName}
        </Typography>
        {
          !subscription || subscription?.product.toUpperCase() === 'BRONZE' ?
            <Typography variant={'body3'} color={levelTab === SubscribeLevelTab.GOLD ? colors.staticDark1 : 'white'}>
              {t(Strings.plan_model_space_member)}：{spaceInfo?.seats}人
            </Typography> :
            <Typography variant={'body3'} color={levelTab === SubscribeLevelTab.GOLD ? colors.staticDark1 : 'white'} className={styles.subscribeInfo}>
              {t(Strings.current_subscribe_plan, { product: t(Strings[subscription.product.toLowerCase()]), seats: subscription.maxSeats })}
              <span className={styles.verticalLine} style={{ backgroundColor: levelTab === SubscribeLevelTab.GOLD ? colors.staticDark1 : 'white' }} />
              {t(Strings.expiration, { date: subscription.deadline })}
              <span className={styles.verticalLine} style={{ backgroundColor: levelTab === SubscribeLevelTab.GOLD ? colors.staticDark1 : 'white' }} />
              {t(Strings.space_seat_info, { num: spaceInfo?.seats })}
            </Typography>
        }
      </div>
    }

    <div className={styles.gradeTabs}>
      {
        tabs.filter((item, index) => index < 13).map((item, index) => {
          if (isRenewal && item.level !== levelTab) {
            return;
          }
          const active = item.level === levelTab;
          return <div onClick={() => { setLevelTab(item.level as any); }} className={classnames({ [styles.active]: active })}>
            {item.levelIcon}
            <Typography
              variant={active ? 'h7' : 'body2'}
              color={active ? item.activeLevelNameColor : item.normalLevelNameColor}
              style={{ marginLeft: 4 }}
            >
              {item.levelName}
            </Typography>
            {
              item.level === recommend && <div className={styles.recommend}>
                <Typography variant={'body3'} color={'white'}>
                  {t(Strings.recommend)}
                </Typography>
              </div>
            }
          </div>;
        })
      }
    </div>
  </header>;
};
