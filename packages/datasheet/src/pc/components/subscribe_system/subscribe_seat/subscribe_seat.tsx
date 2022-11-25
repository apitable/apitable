import { getLanguage, Strings, t } from '@apitable/core';
import { SelectMarkFilled } from '@apitable/icons';
import { Skeleton, Tooltip } from '@apitable/components';
import classnames from 'classnames';
import { ILevelInfo, paySystemConfig, SubscribePageType } from 'pc/components/subscribe_system/config';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { InformationSmallOutlined } from '@apitable/icons';

interface ISubscribeSeatProps {
  seatList: number[];
  seat: number | undefined;
  setSeat: React.Dispatch<React.SetStateAction<number | undefined>>;
  levelInfo: ILevelInfo;
  loading: boolean;
  pageType: SubscribePageType;
}

export const SubscribeSeat: React.FC<ISubscribeSeatProps> = (props) => {
  const { seatList, seat, setSeat, levelInfo, loading, pageType } = props;
  const [hoverSeatIndex, setHoverSeatIndex] = useState<undefined | number>();
  const subscription = useSelector(state => state.billing.subscription);
  const isUpgrade = pageType === SubscribePageType.Upgrade;

  if (pageType === SubscribePageType.Subscribe && levelInfo.level !== paySystemConfig.SILVER.level) {
    return <p className={styles.maxSeat}>
      {t(Strings.subscribe_new_choose_member, { member_num: seatList[0] })}
      <Tooltip content={t(Strings.subscribe_new_choose_member_tips, { member_num: seatList[0] })}>
        <span>
          <InformationSmallOutlined />
        </span>
      </Tooltip>
    </p>;
  }

  if (isUpgrade && levelInfo.level !== paySystemConfig.SILVER.level) {
    return <p className={styles.maxSeat}>
      {t(Strings.subscribe_upgrade_choose_member, {
        old_member_num: Number(subscription?.maxSeats),
        new_member_num: seatList[0],
      })}
      <Tooltip
        content={t(Strings.subscribe_upgrade_choose_member_tips, { old_member_num: Number(subscription?.maxSeats), new_member_num: seatList[0] })}
      >
        <span>
          <InformationSmallOutlined />
        </span>
      </Tooltip>
    </p>;
  }

  /**
   * The following part of the code no longer works and is purely a backup
   */
  return <div className={styles.checkSeatsNum}>
    {loading ? (
      <div style={{ width: '100%' }}>
        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />
      </div>
    ) : seatList.map((item, index) => {
      const active = seat === item;
      const isDisabled = isUpgrade && item <= Number(subscription?.maxSeats);
      return <WrapperTooltip key={index} wrapper={isDisabled} tip={t(Strings.subscribe_disabled_seat)}>
        <div
          className={classnames({
            [styles.seatCard]: true,
            [styles.active]: active,
            [styles.disabledSeatCard]: isDisabled,
          })}
          onClick={() => {!isDisabled && setSeat(item); }}
          onMouseOver={() => {!isDisabled && setHoverSeatIndex(index); }}
          onMouseOut={() => {!isDisabled && setHoverSeatIndex(undefined); }}
          style={{
            fontSize: 16,
            borderColor: (active || hoverSeatIndex === index) ? levelInfo.activeColor : '',
            backgroundColor: active ? levelInfo.cardSelectBg : '',
            color: active ? levelInfo.activeColor : '',
            fontWeight: active ? 'bolder' : 'normal',
          }}
        >
          {item} {getLanguage() === 'zh-CN' && t(Strings.people)}
          {levelInfo.level === paySystemConfig.SILVER.level && index == 0 && <span>(买一送一)</span>}
          {
            active &&
            <SelectMarkFilled size={24} className={styles.checked} color={levelInfo.activeColor} />
          }
        </div>
      </WrapperTooltip>;
    })}
  </div>;
};
