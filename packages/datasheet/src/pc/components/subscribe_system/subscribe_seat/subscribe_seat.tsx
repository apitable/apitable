import { getLanguage, Strings, t } from '@vikadata/core';
import { SelectMarkFilled } from '@vikadata/icons';
import { Skeleton, Tooltip } from '@vikadata/components';
import classnames from 'classnames';
import { ILevelInfo, SubscribePageType } from 'pc/components/subscribe_system/config';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { InformationSmallOutlined } from '@vikadata/icons';

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

  if (pageType === SubscribePageType.Subscribe) {
    return <p className={styles.maxSeat}>
      {t(Strings.subscribe_new_choose_member, { member_num: seatList[0] })}
      <Tooltip content={t(Strings.subscribe_new_choose_member_tips)}>
        <span>
          <InformationSmallOutlined />
        </span>
      </Tooltip>
    </p>;
  }

  if (isUpgrade) {
    return <p className={styles.maxSeat}>
      {t(Strings.subscribe_upgrade_choose_member, {
        old_member_num: subscription?.maxSeats,
        new_member_num: seatList[0],
      })}
      <Tooltip content={t(Strings.subscribe_upgrade_choose_member_tips)}>
        <span>
          <InformationSmallOutlined />
        </span>
      </Tooltip>
    </p>;
  }

  /**
   * 以下部分的代码不再起作用，纯纯粹是为了避免以后产品的席位规格又改回多席位做的备份
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
      return <WrapperTooltip wrapper={isDisabled} tip={t(Strings.subscribe_disabled_seat)}>
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
          {
            active &&
            <SelectMarkFilled size={24} className={styles.checked} color={levelInfo.activeColor} />
          }
        </div>
      </WrapperTooltip>;
    })}
  </div>;
};
