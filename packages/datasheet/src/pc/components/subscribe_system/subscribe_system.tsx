import { LinkButton, Typography, useThemeColors } from '@vikadata/components';
import { Api, ApiInterface, ConfigConstant, integrateCdnHost, Navigation, Settings, StoreActions, Strings, t } from '@vikadata/core';
import { useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { Message } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { paySystemConfig, SubscribePageType } from 'pc/components/subscribe_system/config';
import { SubscribeBar } from 'pc/components/subscribe_system/subscribe_bar/subscribe_bar';
import { SubscribeFeatureCard } from 'pc/components/subscribe_system/subscribe_feature_card/subscribe_feature_card';
import { SubscribeHeader, SubscribeLevelTab } from 'pc/components/subscribe_system/subscribe_header/subscribe_header';
import { SubscribeOffer } from 'pc/components/subscribe_system/subscribe_offer/subscribe_offer';
import { SubscribePayBar } from 'pc/components/subscribe_system/subscribe_pay_bar/subscribe_pay_bar';
import { SubscribePayMethod } from 'pc/components/subscribe_system/subscribe_pay_method/subscribe_pay_method';
import { SubscribeSeat } from 'pc/components/subscribe_system/subscribe_seat/subscribe_seat';
import { SubscribeTime } from 'pc/components/subscribe_system/subscribe_time/subscribe_time';
import { useQuery, useUserRequest } from 'pc/hooks';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.less';

export const contactUs = () => {
  TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
};

type IQueryOrderPriceResponse = Pick<ApiInterface.IQueryOrderPriceResponse, 'priceOrigin' | 'pricePaid' | 'month'>;

export const SubScribeSystem = () => {
  const [seat, setSeat] = useState<undefined | number>();
  const [subscribeLongs, setSubscribeLongs] = useState<undefined | number>();
  const [seatList, setSeatList] = useState<number[]>([]);
  const [monthPrice, setMonthPrice] = useState<IQueryOrderPriceResponse[]>([]);
  const [pay, setPay] = useState(0);
  const [levelTab, setLevelTab] = useState<SubscribeLevelTab>(SubscribeLevelTab.UNUSED);
  const [loading, setLoading] = useState(false);

  const query = useQuery();
  const router = useRouter();
  const { space_id: spaceId } = router.query as { space_id: string };
  const space = useSelector(state => state.space);
  const { signOutReq } = useUserRequest();
  const dispatch = useDispatch();
  const priceInfoCache = useRef<Map<number, Map<number, ApiInterface.IQueryOrderPriceResponse>>>();
  const colors = useThemeColors();
  const subscription = useSelector(state => state.billing.subscription);

  const spaceInfo = space.curSpaceInfo;
  const levelInfo = paySystemConfig[levelTab === SubscribeLevelTab.UNUSED || levelTab == null ? SubscribeLevelTab.SILVER : levelTab];

  useEffect(() => {
    if (seat == null) {
      return;
    }
    const info = priceInfoCache.current?.get(seat);
    if (!info) {
      return;
    }
    setMonthPrice([...info.values()]);
  }, [seat, seatList]);

  useEffect(() => {
    if (!spaceInfo) {
      return;
    }
    if (getPageType() === SubscribePageType.Subscribe) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceInfo]);

  useEffect(() => {
    if (getPageType() === SubscribePageType.Subscribe && seatList.length) {
      // 用户第一次订阅，根据当前空间站的人数推荐订阅的席位数
      setSeat(seatList.find(item => item >= spaceInfo?.seats!) || seatList[seatList.length - 1]);
      return;
    }
    if (getPageType() === SubscribePageType.Renewal && subscription) {
      // 对于续费的需求，席位数并不用发生变更，所以沿用原先产品的席位数即可
      setSeat(subscription?.maxSeats);
      return;
    }
    if (!subscription || !seatList.length) {
      return;
    }
    // 升级，应该是在原来订阅席位之上选择一个选项
    setSeat(seatList.find(item => item > subscription.maxSeats) || seatList[seatList.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatList, spaceInfo?.seats, subscription]);

  useUpdateEffect(() => {
    initVariable();
    if (!spaceId || levelTab === SubscribeLevelTab.UNUSED) {
      return;
    }
    if (levelTab === SubscribeLevelTab.ENTERPRISE) {
      return;
    }
    setLoading(true);
    Api.queryOrderPriceList(levelTab).then(res => {
      const { data, message, success } = res.data;
      setLoading(false);
      if (!success) {
        Message.warning({ content: message });
        setTimeout(async() => {
          await signOutReq();
          Router.redirect(Navigation.LOGIN, {
            query: {
              reference: location.href,
            },
          });
        }, 1000);
        return;
      }

      /**
       * priceInfoCache.current 的数据结构：
       * {
       *   [席位数]:{
       *     [订阅时长]:{
       *       // 具体的产品价格等信息
       *     }
       *   },
       *   ...........
       * }
       */
      priceInfoCache.current = new Map();
      const seatList: number[] = [];
      // const monthPrice: IQueryOrderPriceResponse[] = [];
      for (const v of data) {
        if (!priceInfoCache.current.has(v.seat)) {
          priceInfoCache.current.set(v.seat, new Map());
          seatList.push(v.seat);
        }
        const inner = priceInfoCache.current.get(v.seat);
        if (inner && !inner.has(v.month)) {
          inner.set(v.month, v);
        }
      }
      setSeatList(seatList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelTab, spaceId]);

  useEffect(() => {
    Api.spaceInfo(spaceId!).then(res => {
      const { data, success } = res.data;
      if (success) {
        dispatch(StoreActions.setSpaceInfo(data));
        dispatch(
          StoreActions.updateUserInfo({
            spaceName: data.spaceName,
            spaceLogo: data.spaceLogo,
          }),
        );
      }
    });
  }, [spaceId, dispatch]);

  const getPageType = () => {
    const pageType = query.get('pageType');
    if (!pageType) {
      return SubscribePageType.Subscribe;
    }
    return Number(pageType);
  };

  const initVariable = () => {
    setMonthPrice([]);
    setSeatList([]);
    setSeat(0);
    setSubscribeLongs(6);
  };

  const calcExpireDate = () => {
    if (getPageType() !== SubscribePageType.Renewal) {
      // 如果是订阅，到期时间应该是在今天的基础上+用户订阅的时间
      return dayjs()
        .add(Number(subscribeLongs), 'month')
        .format('YYYY-MM-DD');
    }
    if (!subscription) {
      return null;
    }
    // 如果是续费，应该是在用户原先产品的到期时间+用户续费的时间
    return dayjs(subscription.deadline)
      .add(Number(subscribeLongs), 'month')
      .format('YYYY-MM-DD');
  };

  if (!levelInfo) {
    Message.error({
      content: t(Strings.subscription_expire_error),
    });
    setTimeout(() => {
      window.location.href = '/workbench';
    }, 2 * 1000);
    return <></>;
  }

  return (
    <div className={styles.container}>
      <SubscribeBar />
      <main className={styles.main}>
        <SubscribeHeader levelTab={levelTab} setLevelTab={setLevelTab} levelInfo={levelInfo} pageType={getPageType()} />
        <SubscribeOffer levelTab={levelTab} />

        {levelTab === 'ENTERPRISE' ? (
          <>
            <div className={styles.enterprise}>
              <Typography variant={'h5'} className={styles.enterpriseDesc1}>
                {t(Strings.contact_model_title)}
              </Typography>
              <Typography variant={'body1'} className={styles.enterpriseDesc2}>
                {t(Strings.custom_enterprise)}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image alt={''} style={{ borderRadius: '8px' }} src={integrateCdnHost(Settings.enterprise_qr_code.value)} width={232} height={232} />
              </div>
            </div>
            <div style={{ height: 46 }} />
          </>
        ) : (
          <>
            <div className={styles.productArea}>
              <div className={styles.leftCheckInfo}>
                <div
                  className={classnames({
                    [styles.align]: true,
                    [styles.marginBottom]: getPageType() === SubscribePageType.Renewal,
                  })}
                >
                  <Typography
                    variant={'body2'}
                    className={classnames(styles.checkInfoHead, { [styles.marginTop0]: getPageType() === SubscribePageType.Renewal })}
                    color={colors.secondLevelText}
                  >
                    {t(Strings.plan_model_choose_members)}:
                  </Typography>
                  {getPageType() === SubscribePageType.Renewal ? (
                    <Typography variant={'body2'} style={{ display: 'flex' }} color={colors.thirdLevelText}>
                      <TComponent
                        tkey={t(Strings.renewal_seat_warning)}
                        params={{
                          link: (
                            <LinkButton
                              style={{
                                color: levelInfo.activeColor,
                                borderBottom: 0,
                              }}
                              onClick={() => {
                                window.location.href = window.location.origin + window.location.pathname + `?pageType=${SubscribePageType.Upgrade}`;
                              }}
                            >
                              {t(Strings.click_here)}
                            </LinkButton>
                          ),
                        }}
                      />
                    </Typography>
                  ) : (
                    <SubscribeSeat
                      seatList={seatList}
                      seat={seat}
                      setSeat={setSeat}
                      levelInfo={levelInfo}
                      loading={loading}
                      pageType={getPageType()}
                    />
                  )}
                </div>
                {getPageType() === SubscribePageType.Subscribe && (
                  <Typography variant={'body3'} className={styles.seatNumNote}>
                    <TComponent
                      tkey={t(Strings.plan_model_members_tips)}
                      params={{
                        space_leve: (
                          <LinkButton
                            color={levelInfo.activeColor}
                            style={{ marginLeft: 4 }}
                            onClick={() => setLevelTab(levelTab === SubscribeLevelTab.SILVER ? SubscribeLevelTab.GOLD : SubscribeLevelTab.ENTERPRISE)}
                          >
                            {levelTab === SubscribeLevelTab.SILVER ? t(Strings.gold) : t(Strings.enterprise)}
                          </LinkButton>
                        ),
                      }}
                    />
                  </Typography>
                )}

                <div
                  className={classnames({
                    [styles.align]: true,
                    [styles.marginTop50]: getPageType() === SubscribePageType.Upgrade,
                  })}
                >
                  <Typography
                    variant={'body2'}
                    className={classnames(styles.checkInfoHead, { [styles.marginTop0]: getPageType() === SubscribePageType.Upgrade })}
                    color={colors.secondLevelText}
                  >
                    {t(Strings.plan_model_choose_period)}:
                  </Typography>
                  {
                    <SubscribeTime
                      monthPrice={monthPrice}
                      levelInfo={levelInfo}
                      subscribeLongs={subscribeLongs}
                      setSubscribeLongs={setSubscribeLongs}
                      loading={loading}
                    />
                  }
                </div>
                <Typography variant={'body3'} className={styles.expireTime} color={colors.fc3}>
                  {t(Strings.plan_model_period_tips)}：{calcExpireDate()}
                </Typography>

                <div className={styles.align}>
                  <Typography variant={'body2'} className={styles.checkInfoHead} color={colors.secondLevelText}>
                    {t(Strings.choose_pey_method)}:
                  </Typography>
                  <SubscribePayMethod pay={pay} setPay={setPay} levelInfo={levelInfo} />
                </div>
              </div>
              <SubscribeFeatureCard levelInfo={levelInfo} />
            </div>
            <div className={styles.breakLine} />
            <SubscribePayBar
              priceInfoCache={priceInfoCache}
              seat={seat}
              subscribeLongs={subscribeLongs}
              levelInfo={levelInfo}
              levelTab={levelTab}
              spaceId={spaceId || ''}
              pay={pay}
              pageType={getPageType()}
            />
          </>
        )}
      </main>
    </div>
  );
};
