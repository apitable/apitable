import { Button, Checkbox, Typography, useThemeColors } from '@vikadata/components';
import { ArrowRightOutlined, CheckOutlined, ChevronRightOutlined, SelectOutlined, UpgradeFilled } from '@vikadata/icons';
import { useMount } from 'ahooks';
import { Col, Modal, Row } from 'antd';
import classNames from 'classnames';
import { ClassValue } from 'classnames/types';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import * as React from 'react';
import { FC } from 'react';
import InfoIcon from 'static/icon/common/common_icon_information.svg';
import ActivityPng from 'static/icon/space/space_img_activity.png';
// import PayingModalHeaderDefaultBg from 'static/icon/space/space_img_silverbj.png';
// import PayingModalHeaderCapacityBg from 'static/icon/space/space_img_capacitybj.png';
import PaySucceedTickingPng from 'static/icon/space/space_img_success.png';
import GoldImg from 'static/icon/workbench/workbench_account_gold_icon.png';
import styles from './style.module.less';
// const PayingModalHeaderBg = {
//   default: PayingModalHeaderDefaultBg,
//   capacity: PayingModalHeaderCapacityBg
// };
// modal标题
export const PayingModalHeader = (data: { title: React.ReactNode, subTitle?: React.ReactNode, backgroundImage?: string }) => {
  const { title, subTitle, backgroundImage } = data;
  return (
    <div className={styles.payingModalHeader} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Typography variant="h2" className={styles.title}>{title}</Typography>
      <Typography variant="body2" className={styles.subTitle}>{subTitle}</Typography>
    </div>
  );
};
// modal子标题
export const PayingModalTitle = (data: { title: string, tip?: string, themeColor?: string }) => {
  const { title, tip, themeColor } = data;
  return (
    <div className={styles.payingModalTitle}>
      <span className={styles.before} style={{ backgroundColor: themeColor }} />
      <Typography variant="h4" className={styles.title}>{title}</Typography>
      {
        tip &&
        <Tooltip
          title={tip}
          trigger="click"
          placement="top"
        >
          <InfoIcon className={styles.infoIcon} />
        </Tooltip>
      }
    </div>
  );
};
// 等级对比-价格对比
export const LevelPrice = (data: { title: React.ReactNode, sup?: React.ReactNode, sub?: React.ReactNode }) => {
  const { title, sup, sub } = data;
  return (
    <span className={classNames(styles.levelPrice, { [styles.onlyTitle]: !sup && !sub })}>
      <sup>{sup}</sup>
      <span>{title}</span>
      <sub>{sub}</sub>
    </span>
  );
};

// 等级对比-操作按钮
export const LevelOperation: FC<{
  type: 'upgradeSeats' | 'upgradeLevel' | 'customerService' | 'free',
  className?: string
}> = ({ type, className }): React.ReactElement => {
  const classBase: ClassValue[] = [styles.levelOperation, className];
  switch (type) {
    case 'upgradeLevel':
      return <Button className={classNames(classBase)} color="primary">升级</Button>;
    case 'upgradeSeats':
      return <Button className={classNames(classBase)} color="primary">升级成员数</Button>;
    case 'customerService':
      return <Button className={classNames(classBase)} color="primary">联系我们</Button>;
    case 'free':
    default:
      return <Typography variant="body2" className={classNames(classBase, styles.text)}>免费</Typography>;
  }
};

// 等级对比-footer
export const LevelOperationFooter: FC<{
  type: 'upgradeSeats' | 'upgradeLevel' | 'customerService' | 'free',
  className?: string
}> = ({ type, className }): React.ReactElement => {
  return <div><LevelOperation type="upgradeSeats" /></div>;
};

// 特权列表
export const PrivilegeList = (data: { title: string, privilegeList: string[], helper?: string, themeColor?: string }) => {
  const { title, privilegeList, helper, themeColor } = data;
  return (
    <div className={styles.privilegeList}>
      <Typography variant="body2" className={styles.title}>{title}</Typography>
      <div className={styles.itemWrapper}>
        {
          privilegeList.map((item, index) => (
            <div className={styles.item} key={item + index}>
              <SelectOutlined color={themeColor} size={16} />
              <Typography variant="body4" className={styles.itemContent}>{item}</Typography>
            </div>
          ))
        }
      </div>
      <Typography variant="body4" className={styles.helper}>{helper}</Typography>
    </div>
  );
};
// 升级前后参数对比
export const ParamsComparison = (data: { prev: string, cur: string, themeColor?: string }) => {
  const { prev, cur, themeColor } = data;
  return (
    <div className={styles.paramsComparison}>
      <Typography variant="body2" className={styles.prev}>{prev}</Typography>
      <ArrowRightOutlined color={themeColor} />
      <Typography variant="body2">{cur}</Typography>
    </div>
  );
};
// 金额计算
export const PriceTotal = (data: { type: 'default' | 'subtotal' | 'total' | 'red', price: number, label?: string }) => {
  const { type, price, label } = data;
  switch (type) {
    case 'subtotal':
      return (
        <Typography variant="body2" className={classNames(styles.priceTotal, styles.subtotal)}>
          <Typography variant="h5" className={styles.label}>{label}</Typography>
          <Typography variant="h5" className={styles.unit}>¥</Typography>
          <Typography variant="h3" className={styles.price}>{price.toLocaleString()}</Typography>
        </Typography>
      );
    case 'total':
      return (
        <Typography variant="body4" className={classNames(styles.priceTotal, styles.total)}>
          <Typography variant="h4" className={styles.label}>{label}</Typography>
          <Typography variant="h4" className={styles.unit}>¥</Typography>
          <Typography variant="h1" className={styles.price}>{price.toLocaleString()}</Typography>
        </Typography>
      );
    case 'default':
    case 'red':
    default:
      return (
        <Typography variant="body2" className={classNames(styles.priceTotal, styles.default, { [styles.red]: type === 'red' })}>
          <span className={styles.unit}>¥</span>
          {price.toLocaleString()}</Typography>
      );
  }
};

// 订单详情
export const OrderDetails = (data:
                               { [key in 'title' | 'spaceName' | 'expireTime' | 'capacity' | 'total' | 'discount' | 'seats']?: React.ReactNode } &
                               { subtotal: number }
) => {
  const { title, subtotal } = data;
  const LabelMap = [
    {
      spaceName: '空间站名称：',
      seats: '空间站成员数：',
      capacity: '空间站容量：',
      expireTime: '购买时长',
    },
    {
      total: '总价：',
      discount: '优惠：'
    }
  ];

  return (
    <div className={styles.orderDetails}>
      {title && <Typography variant="body2" className={styles.title}>{title}</Typography>}
      {
        LabelMap.map(group => (
          Object.keys(group).some(item => data[item]) && (
            <div className={styles.infoGroup} key={Object.keys(group)[0]}>
              {
                Object.keys(group).map(key => (
                  data[key] && (
                    <div className={styles.item} key={key}>
                      <Typography variant="body3" className={styles.label}>{group[key]}</Typography>
                      <div className={styles.value}>{data[key]}</div>
                    </div>
                  )
                ))
              }
            </div>
          )
        ))
      }
      <div className={styles.footer}>
        <PriceTotal type="subtotal" price={subtotal} label="小计:" />
      </div>
    </div>
  );
};

// CheckBox
type ICheckedTagSize = 24 | 32;
export const CheckWrap: FC<{
  checked?: boolean, checkedTagSize: ICheckedTagSize,
  themeColor?: string, style?: React.CSSProperties, className?: string,
  onClick?: (e: React.MouseEvent) => void
}> = (props) => {
  const { checked, checkedTagSize = 24, themeColor, style, className, onClick } = props;
  const colors = useThemeColors();
  const checkedColor = themeColor || colors.primaryColor;
  const finalStyle = {
    borderColor: checked ? checkedColor : colors.lineColor,
    ...style,
  };
  const checkedTagWrapStyle: React.CSSProperties = {
    width: checkedTagSize + 'px',
    height: checkedTagSize + 'px',
    borderRightColor: checkedColor,
    borderBottomColor: checkedColor,
    borderWidth: `${checkedTagSize / 2}px`,
    visibility: checked ? 'visible' : 'hidden',
  };
  const checkedIconSizeMap: { [key in ICheckedTagSize]: number } = {
    24: 12,
    32: 16,
  };
  return (
    <div className={classNames(styles.checkWrap, className)} style={finalStyle} onClick={onClick}>
      {props.children}
      <div className={styles.checkedTagWrap} style={checkedTagWrapStyle}>
        <CheckOutlined color={colors.defaultBg} size={checkedIconSizeMap[checkedTagSize]} />
      </div>
    </div>
  );
};
// 优惠tag
export const DiscountTag: FC<{ className?: string }> = (props) => {
  return (
    <Typography variant="body3" className={classNames(styles.discountTag, props.className)}>
      {props.children}
    </Typography>
  );
};

// 倒计时
export const Countdown: FC<{ className?: string }> = (props) => {
  return (
    <Typography variant="body4" className={classNames(styles.countdown, props.className)}>
      {props.children}
    </Typography>
  );
};

// 容量选择包
export interface ICapacityCheckbox {
  key: React.Key,
  value?: React.ReactNode,
  price?: React.ReactNode,
  desc?: React.ReactNode,
  originalPrice?: React.ReactNode,
  discount?: React.ReactNode,
  countdown?: React.ReactNode,
  checked?: boolean,
  disabled?: boolean,
  onClick?: () => void,
  themeColor?: string,
  className?: string,
}

// 容量选择包
export const CapacityCheckbox = (data: ICapacityCheckbox) => {
  const {
    value, price, desc, originalPrice, checked,
    discount, countdown, onClick, themeColor, className
  } = data;
  return (
    <CheckWrap
      checked={checked}
      checkedTagSize={32}
      className={classNames(styles.capacityCheckbox, { [styles.checked]: checked }, className)}
      themeColor={themeColor}
      onClick={onClick}
    >
      <Typography variant="h1" className={styles.value}>{value}</Typography>
      <Typography variant="h5" className={styles.price}>{price}</Typography>
      <Typography variant="body3" className={styles.desc}>{desc}</Typography>
      <Typography variant="body3" className={styles.originalPrice}>{originalPrice}</Typography>
      {discount && <DiscountTag className={styles.discount}>{discount}</DiscountTag>}
      {countdown && <Countdown className={styles.count}>{countdown}</Countdown>}
    </CheckWrap>
  );
};

// 容量选择列表
export const CapacityOptions = (data: {
  checkedKey?: React.Key,
  onChange?: (key: React.Key) => void,
  optionData: ICapacityCheckbox[],
  themeColor?: string,
}): React.ReactElement => {
  const { checkedKey = '', onChange, optionData, themeColor } = data;
  const [key, setKey] = React.useState(checkedKey);
  const handleClick = (key) => {
    setKey(key);
    onChange && onChange(key);
  };
  return (
    <div className={styles.capacityOptions}>
      <div>
        {
          optionData.map(item => (
            <CapacityCheckbox
              {...item}
              onClick={() => handleClick(item.key)}
              checked={key === item.key}
              themeColor={themeColor}
              className={styles.optionItem}
            />
          ))
        }
      </div>
      <Typography variant="body3" className={styles.tip}>
        * 有效期与白银级空间一致，购买后可使用至 2022年03月06日
        <a href="#"><InfoIcon className={styles.infoIcon} /></a>
      </Typography>
    </div>
  );
};
// 时长/席位选择
export const BlockSelector = (data: {
  checkedKey?: React.Key,
  onChange?: (key: React.Key) => void,
  optionData:
    {
      key: React.Key,
      value: React.ReactNode,
      discount?: React.ReactNode,
      countdown?: React.ReactNode,
      isMore?: boolean,
      disabled?: boolean,
      tip?: string;
    }[],
  themeColor?: string,
}) => {
  const { checkedKey = '', onChange, optionData, themeColor } = data;
  const colors = useThemeColors();
  const [key, setKey] = React.useState(checkedKey);
  const handleClick = (key) => {
    setKey(key);
    onChange && onChange(key);
  };
  const isMoreInLastData = optionData[optionData.length - 1].isMore;
  const lastOptionIndex = optionData.length - (isMoreInLastData ? 2 : 1);
  const firstOptionIndex = optionData.findIndex(item => !item.disabled);
  return (
    <Row className={styles.blockSelector}>
      {
        optionData.map((item, index) => {
          if (item.isMore) {
            return (
              <Col span={4} className={styles.isMore} key={item.key}>
                <Typography variant="body4" color={colors.thirdLevelText}>{item.value}</Typography>
                <ChevronRightOutlined color={colors.thirdLevelText} size={16} />
              </Col>
            );
          }

          if (item.disabled && item.tip) {
            return (
              <Tooltip
                title={item.tip}
                trigger="hover"
                placement="top"
              >
                <Col span={4} key={item.key}>
                  <CheckWrap
                    checkedTagSize={24}
                    className={classNames(styles.checkItem, styles.disabled)}
                    themeColor={themeColor}
                  >
                    {item.value}
                  </CheckWrap>
                </Col>
              </Tooltip>
            );
          }
          return (
            <Col span={4} key={item.key}>
              <CheckWrap
                checkedTagSize={24}
                checked={key === item.key}
                className={classNames(
                  styles.checkItem,
                  {
                    [styles.checked]: key === item.key,
                    [styles.last]: [lastOptionIndex, 5].includes(index),
                    [styles.disabled]: item.disabled,
                    [styles.first]: [firstOptionIndex, 6].includes(index),
                  })}
                onClick={() => { !item.disabled && handleClick(item.key); }}
              >
                <Typography variant="body2" className={styles.value}>{item.value}</Typography>
                {item.discount && <DiscountTag className={styles.discount}>{item.discount}</DiscountTag>}
                {item.countdown && <Countdown className={styles.count}>{item.countdown}</Countdown>}
              </CheckWrap>
            </Col>
          );
        })
      }
    </Row>
  );
};

// 订单v币以及优惠金额计算
export const PayingTotal = (data: { totalV: number, curV: number, curPrice: number, discount?: number }) => {
  const { totalV, curV, curPrice, discount } = data;
  return (
    <div className={styles.payingTotal}>
      <div className={styles.left}>
        <Typography variant="body2" className={styles.curVCount}>当前v币：<span className={styles.bold}>{totalV}</span></Typography>
        <Checkbox>
          <span className={styles.checkBox}>
            <Typography variant="body2" className={styles.usedVCount}>已用<span className={styles.bold}>{curV}</span></Typography>
            <span className={styles.goldImg}>
              <Image src={GoldImg} />
            </span>
            <Typography variant="body2" className={styles.voucher}>抵用<span className={styles.bold}>{curV}</span>元</Typography>
          </span>
        </Checkbox>
      </div>
      <div className={styles.right}>
        <Typography variant="body3" className={styles.cutDown}>已省{discount} 元</Typography>
        <PriceTotal type="total" price={curPrice} label="总计：" />
      </div>
    </div>
  );
};

// TODO: del
export const PayingFooter = () => {
  return (
    <div className={styles.payingFooter}>
      <Row>
        <Col span={17}>
          <div className={styles.payingTotal}>
            <div className={styles.left}>
              <Typography variant="body2" className={styles.curVCount}>当前v币：<span className={styles.bold}>2000</span></Typography>
              <Checkbox>
                <span className={styles.checkBox}>
                  <Typography variant="body2" className={styles.usedVCount}>已用<span className={styles.bold}>2679242</span></Typography>
                  <span className={styles.goldImg}>
                    <Image src={GoldImg} />
                  </span>
                  <Typography variant="body2" className={styles.voucher}>抵用<span className={styles.bold}>2000</span>元</Typography>
                </span>
              </Checkbox>
            </div>
            <div className={styles.right}>
              <Typography variant="body3" className={styles.cutDown}>已省 1,500 元</Typography>
              <PriceTotal type="total" price={900} label="总计：" />
            </div>
          </div>
        </Col>
        <Col span={7} className={styles.buttonWrap}>
          <Button color="primary">支付订单</Button>
        </Col>
      </Row>
    </div>
  );
};

// 支付失败
export const showPaymentFailed = () => {
  console.log('ssss');
  return (
    <Modal
      title="Basic Modal"
      visible
    >
      支付失败
    </Modal>
  );
};

// 支付成功打勾动画
export const PaySucceedTicking = () => {
  return (
    <div className={styles.paySucceedTicking}>
      <Image src={PaySucceedTickingPng} />
    </div>
  );
};
// 升级成功之后促销活动
export const UpgradedPromotion = () => {
  return (
    <div className={styles.upgradedPromotion} style={{ backgroundImage: `url(${ActivityPng})` }}>
      <Typography variant="h5" className={styles.content}>9元 换购 50G 空间容量包，仅限今日</Typography>
    </div>
  );
};
// 支付成功
export const PaySucceed = (data: {
  title: string,
  time: string,
  count: number,
  originalPrice: number,
  finalPrice: number,
  vCount?: number,
  discount?: number,

}) => {
  const { title, time, count, originalPrice, finalPrice, discount, vCount } = data;
  const [promotionVisible, setPromotionVisible] = React.useState(false);
  useMount(() => {
    setTimeout(() => {
      setPromotionVisible(true);
    }, 500);
  });
  return (
    <div className={styles.paySucceed}>
      <PaySucceedTicking />
      <Typography variant="h3" className={styles.title}>购买成功</Typography>
      <div className={styles.detail}>
        <Row>
          <Col span={11}>服务内容</Col>
          <Col span={5}>有效期至</Col>
          <Col span={4}>数量</Col>
          <Col span={4}>金额</Col>
        </Row>
        <Row>
          <Col span={11}>{title}</Col>
          <Col span={5}>{time}</Col>
          <Col span={4}>{count}</Col>
          <Col span={4}>¥ {originalPrice}</Col>
        </Row>
        {
          discount &&
          <Row>
            <Col span={20} className={styles.label}>优惠</Col>
            <Col span={4}>{discount}</Col>
          </Row>
        }
        {
          vCount &&
          <Row>
            <Col span={20} className={styles.label}>v币抵扣</Col>
            <Col span={4}>{vCount}</Col>
          </Row>
        }
        <Row>
          <Col span={20} className={styles.label}>实付款</Col>
          <Col span={4}>¥ {finalPrice}</Col>
        </Row>
      </div>
      <Typography variant="body2" className={styles.email}>账单已发送至 viviivi@vikadata.com</Typography>
      <div className={styles.promotion}>
        {promotionVisible && <UpgradedPromotion />}
      </div>
    </div>
  );
};

// 左侧粘粘升级button
export const FixedUpgrade = () => {
  return (
    <div className={styles.fixedUpgrade}>
      <UpgradeFilled />
      升 级
    </div>
  );
};
