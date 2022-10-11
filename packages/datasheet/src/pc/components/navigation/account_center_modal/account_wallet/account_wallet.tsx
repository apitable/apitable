import { Button, Skeleton, useThemeColors, Pagination } from '@vikadata/components';
import { Api, ConfigConstant, DEFAULT_TIMEZONE, IPageDataBase, isVCode, Settings, Strings, t } from '@vikadata/core';
import { useMount, useToggle } from 'ahooks';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import classNames from 'classnames';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';
import { WithTipTextInput } from 'pc/components/common/input/with_tip_input';
import { NormalModal } from 'pc/components/common/modal/normal_modal';
import { Tooltip } from 'pc/components/common/tooltip';
import { useBilling, useRequest } from 'pc/hooks';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import InfoIcon from 'static/icon/common/common_icon_information.svg';
import RightIcon from 'static/icon/common/common_icon_level_right.svg';
import GoldImg from 'static/icon/workbench/workbench_account_gold_icon.png';
import LeftCardBg from 'static/icon/workbench/workbench_account_left_bj.png';
import AccountLogo from 'static/icon/workbench/workbench_account_logo.svg';
import { showExchangeSuccess } from './exchange_success';
import styles from './style.module.less';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IIntegralInfo {
  totalIntegral: number;
}

interface IParams {
  name: string;
}

interface IRecord {
  action: string;
  actionName: string;
  alterType: number;
  alterValue: string;
  createdAt: string;
  params: null | IParams;
}

interface IPageData extends IPageDataBase {
  records: IRecord[];
}

const ErrContant = {
  FormatErr: t(Strings.invalid_redemption_code_entered),
  EmptyErr: t(Strings.no_redemption_code_entered)
};
export const AccountWallet: FC = () => {
  const colors = useThemeColors();
  const AlterTypeInfo = {
    0: { color: colors.warningColor, text: '+' },
    1: { color: colors.errorColor, text: '-' }
  };
  // 收支记录
  const [pageNo, setPageNo] = useState(1);
  const [pageData, setPageData] = useState<IPageData | null>(null);
  // 订阅信息
  const { getUserIntegral } = useBilling();
  const { data: integralInfo, run: getUserIntegralRun, loading: cardLoading } = useRequest<IIntegralInfo>(getUserIntegral, { manual: true });
  const [inputErr, setInputErr] = useState('');
  const [inputText, setInputText] = useState('');
  const [exchangeModal, { set: setExchangeModal }] = useToggle(false);
  const { run: getRecordsData, loading: recordsGetting } =
    useRequest((pageNo: number) => Api.getUserIntegralRecords(pageNo).then(res => {
      const { data, success } = res.data;
      if (success) {
        setPageData(data);
      }
    }), { manual: true });
  const { run: exchange, loading: exchanging } =
    useRequest((code: string) => Api.vCodeExchange(code).then(res => {
      const { message, success, data } = res.data;
      if (success) {
        setExchangeModal(false);
        showExchangeSuccess({ amount: data, refreshData: refreshData });
      } else {
        setInputErr(message);
      }
    }), { manual: true });
  useMount(() => {
    getUserIntegralRun();
  });
  useEffect(() => {
    pageNo && getRecordsData(pageNo);
  }, [pageNo, getRecordsData]);
  const refreshData = () => {
    pageNo === 1 ? getRecordsData(pageNo) : setPageNo(1);
    getUserIntegralRun();
  };
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputText(val);
    setInputErr('');
  };
  const cancelExchange = () => {
    setExchangeModal(false);
  };
  const confirmExchange = () => {
    if (inputErr) return;
    if (!inputText) {
      setInputErr(ErrContant.EmptyErr);
      return;
    }
    if (!isVCode(inputText)) {
      setInputErr(ErrContant.FormatErr);
      return;
    }
    exchange(inputText.trim());
  };

  const columns: ColumnProps<IRecord>[] = [
    {
      title: t(Strings.behavior_type),
      dataIndex: 'action',
      key: 'action',
      render: (value, record) => t(Strings[value], { name: record.params && record.params.name ? record.params.name : '' }),
      align: 'left',
      ellipsis: true
    },
    {
      title: t(Strings.time),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => dayjs(value).tz(DEFAULT_TIMEZONE).format(t(Strings.time_format_year_month_and_day)),
      align: 'left',
      width: 200
    },
    {
      title: t(Strings.remarks),
      dataIndex: 'alterType',
      key: 'alterType',
      render: (value, record) => {
        return (
          <div className={styles.money} style={{ color: AlterTypeInfo[value].color }}>
            {AlterTypeInfo[value].text}
            {Number(record.alterValue).toLocaleString()}
            <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}><Image alt='gold' src={GoldImg} width={16} height={16} /></span>
          </div>
        );
      },
      align: 'left',
      width: 150
    }
  ];
  const inLoading = recordsGetting || !pageData;
  const shouldShowRecords = !inLoading;
  return (
    <div className={styles.accountWalletWrapper}>
      <div className={styles.title}>{t(Strings.account_wallet)}
        <a href={Settings.account_wallet_help.value} target='_blank' rel='noreferrer'><InfoIcon /></a>
      </div>
      <div className={styles.content}>
        <div className={styles.bigCardWrap}>
          <div className={styles.cardWrap}>
            {
              !cardLoading &&
              <div
                className={classNames(styles.card, styles.curCard)}
                style={{
                  backgroundColor: cardLoading ? colors.lowestBg : colors.primaryColor,
                  position: 'relative'
                }}
              >
                <Image src={LeftCardBg} layout={'fill'} />
                <div className={styles.cardTop}>
                  <div className={styles.cardTopLeft}>
                    <div className={styles.curVTitle}>{t(Strings.current_v_coins)}</div>
                    <div
                      className={styles.curV}>
                      <span>{integralInfo?.totalIntegral.toLocaleString()}</span>
                      {t(Strings.v_coins)}
                    </div>
                  </div>
                  <div className={styles.cardTopRight}>
                    <Button
                      color='primary'
                      size='small'
                      shape='round'
                      onClick={() => setExchangeModal(true)}
                      style={{ position: 'absolute', top: 0, right: 0, fontSize: '14px', lineHeight: '14px' }}
                    >
                      {t(Strings.redemption_code_button)}<RightIcon width={8} height={8} fill={colors.black[50]} style={{ marginLeft: '4px' }} />
                    </Button>
                  </div>
                </div>
                <div className={styles.cardBottom}>
                  <Tooltip title={t(Strings.get_v_coins)}>
                    <span><AccountLogo />{t(Strings.how_to_get_v_coins)}</span>
                  </Tooltip>
                </div>
              </div>
            }
          </div>
          {!cardLoading &&
            <div
              className={classNames(styles.cardWrap, styles.rightCardWrap)}>{t(Strings.stay_tuned_for_more_features)}
            </div>
          }
        </div>
        <div className={styles.subTitle}>{t(Strings.income_expenditure_records)}</div>
        {
          inLoading && (
            <div className={styles.skeleton}>
              <Skeleton count={1} width='38%' />
              <Skeleton count={2} />
              <Skeleton count={1} width='61%' />
            </div>
          )
        }
        {
          pageData && shouldShowRecords &&
          <>
            <Table
              columns={columns}
              dataSource={pageData.records}
              pagination={false}
              rowKey={record => record.createdAt}
            />
            {
              pageData.total !== 0 &&
              <div className={styles.pagination}>
                <Pagination
                  current={pageNo}
                  total={pageData!.total}
                  pageSize={ConfigConstant.USER_INTEGRAL_RECORDS_PAGE_SIZE}
                  onChange={pageNo => setPageNo(pageNo)}
                />
              </div>
            }

          </>
        }
      </div>
      {
        <NormalModal
          title={t(Strings.redemption_code)}
          maskClosable={false}
          visible={exchangeModal}
          centered
          okText={t(Strings.exchange)}
          onCancel={cancelExchange}
          onOk={confirmExchange}
          okButtonProps={{ loading: exchanging, disabled: exchanging || !inputText }}
          className={styles.exchangeCodeModal}
        >
          <div className={styles.exchangeTip}>{t(Strings.exchange_code_times_tip)}</div>
          <WithTipTextInput
            placeholder={t(Strings.entered_the_wrong_redemption_code)}
            onChange={inputChange}
            className={styles.input}
            error={Boolean(inputErr)}
            helperText={inputErr}
            block
          />
        </NormalModal>
      }
    </div>
  );
};
