/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// FIXME:THEME
import cx from 'classnames';
import { useMemo } from 'react';
import { colors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
// import { showSeatsUpgrading, showLevelCompare, showLevelRenewing } from 'pc/components/subscription';
import {
  BronzeDarkFilled,
  BronzeLightFilled,
  EnterpriseDarkFilled,
  EnterpriseLightFilled,
  GoldDarkFilled,
  GoldLightFilled,
  SilverDarkFilled,
  SilverLightFilled,
} from '@apitable/icons';
import { ThemeIcon } from 'pc/components/common/theme_icon/theme_icon';
import BronzeCardBg from 'static/icon/space/bronze_card_bg.png';
import BronzeCardSkin from 'static/icon/space/bronze_card_medal.png';
import EnterpriseCardBg from 'static/icon/space/enterprise_card_bg.png';
import EnterpriseCardSkin from 'static/icon/space/enterprise_card_medal.png';
import GoldenCardBg from 'static/icon/space/gold_card_bg.png';
import GoldenCardSkin from 'static/icon/space/gold_card_medal.png';
import SilverCardBg from 'static/icon/space/silver_card_bg.png';
import SilverCardSkin from 'static/icon/space/silver_card_medal.png';
import { ISpaceLevelInfo, ISpaceLevelInfoValue, ISpaceLevelType, Position } from './interface';
import styles from './style.module.less';

export const DELETE_SPACE_CONTEXT_MENU_ID = 'DELETE_SPACE_CONTEXT_MENU_ID';

export const getPercent = (percent: number) => {
  if (percent <= 0) {
    return 0;
  }
  if (percent < 0.01 && percent < 1) {
    return 0.01;
  }
  if (percent >= 1) {
    return 1;
  }
  return percent;
};

const bronzeAndFree = {
  strokeColor: `${colors.bronzeFg}80`,
  trailColor: colors.fc5,
  hightLightColor: colors.bronzeFg,
  cardTitleColor: colors.orange[900],
  cardTagStyle: { background: `${colors.bronzeFg}4d`, color: colors.fc8 },
  secondTextColor: `${colors.bronzeFg}CC`,
  skinStyle: {
    right: 16,
    top: 16,
    width: '68px',
    height: '82px',
  },
  cardTagPosition: Position.L,
  cardBg: BronzeCardBg,
  cardSkin: BronzeCardSkin,
  upgradeBtnColor: undefined,
  expirationColor: undefined,
  logo: <ThemeIcon darkIcon={<BronzeDarkFilled size={20} />} lightIcon={<BronzeLightFilled size={20} />} />,
  getLabel: (text: string) => {
    return (
      <span className={cx(styles.spaceLevelTag, styles.bronzeTag)}>
        <span className={styles.text}>{text}</span>
      </span>
    );
  },
};

const silverAndPlus = {
  strokeColor: colors.silverFg,
  trailColor: colors.silverBg,
  cardTitleColor: colors.indigo[600],
  hightLightColor: colors.silverFg,
  cardTagStyle: { background: colors.indigo[200], color: colors.fc8 },
  secondTextColor: colors.silverFg,
  cardTagPosition: Position.L,
  cardBg: SilverCardBg,
  cardSkin: SilverCardSkin,
  upgradeBtnColor: undefined,
  expirationColor: undefined,
  skinStyle: {
    right: 16,
    top: 16,
    width: '68px',
    height: '82px',
  },
  logo: <ThemeIcon darkIcon={<SilverDarkFilled size={20} />} lightIcon={<SilverLightFilled size={20} />} />,
  getLabel: (text: string) => (
    <span className={cx(styles.spaceLevelTag, styles.silverTag)}>
      <span className={styles.text}>{text}</span>
    </span>
  ),
};

const goldenAndPro = {
  strokeColor: colors.warningColor,
  trailColor: colors.goldenBg,
  cardTitleColor: colors.orange[800],
  hightLightColor: colors.orange[500],
  cardTagStyle: { background: colors.orange[400], color: colors.fc8 },
  secondTextColor: `${colors.orange[800]}cc`,
  expirationColor: colors.orange[600],
  cardTagPosition: Position.L,
  cardBg: GoldenCardBg,
  cardSkin: GoldenCardSkin,
  upgradeBtnColor: undefined,
  skinStyle: {
    right: 16,
    top: 16,
    width: '68px',
    height: '82px',
  },
  logo: <ThemeIcon darkIcon={<GoldDarkFilled size={20} />} lightIcon={<GoldLightFilled size={20} />} />,
  getLabel: (text: string) => (
    <span className={cx(styles.spaceLevelTag, styles.goldTag)}>
      <span className={styles.text}>{text}</span>
    </span>
  ),
};
const LevelConfigMap = {
  bronze: bronzeAndFree,
  free: bronzeAndFree,
  silver: silverAndPlus,
  plus: silverAndPlus,
  starter: silverAndPlus,
  golden: goldenAndPro,
  pro: goldenAndPro,
  enterprise: {
    strokeColor: colors.enterpriseFg,
    trailColor: colors.enterpriseBg,
    cardTitleColor: colors.fc8,
    hightLightColor: colors.indigo[600],
    cardTagStyle: { background: `${colors.indigo[900]}4d`, color: colors.fc8 },
    secondTextColor: `${colors.fc8}CC`,
    cardTagPosition: Position.L,
    cardBg: EnterpriseCardBg,
    cardSkin: EnterpriseCardSkin,
    buttonStyle: { background: 'none', border: `1px solid ${colors.fc8}` },
    upgradeBtnColor: colors.indigo[600],
    expirationColor: undefined,
    skinStyle: {
      right: 16,
      top: 0,
      width: '68px',
      height: '82px',
    },
    logo: <ThemeIcon darkIcon={<EnterpriseDarkFilled size={20} />} lightIcon={<EnterpriseLightFilled size={20} />} />,
    getLabel: (text: string) => (
      <span className={cx(styles.spaceLevelTag, styles.enterpriseTag)}>
        <span className={styles.text}>{text}</span>
      </span>
    ),
  },
};

const getSpaceConfig = (
  spaceLevel: keyof typeof LevelConfigMap,
  texts: { title: string; titleTip: string; tagText: string; buttonText: string },
): ISpaceLevelInfoValue => {
  const config = LevelConfigMap[spaceLevel];
  const { title, titleTip, tagText, buttonText } = texts;
  return {
    title,
    strokeColor: config.strokeColor,
    trailColor: config.trailColor,
    hightLightColor: config.hightLightColor,
    levelCard: {
      titleTip,
      titleColor: config.cardTitleColor,
      buttonText,
      onClick: () => {},
      cardBg: config.cardBg,
      cardSkin: config.cardSkin,
      cardTagPosition: config.cardTagPosition,
      skinStyle: config.skinStyle,
      tagText,
      tagStyle: config.cardTagStyle,
      expiration: -1,
      secondTextColor: config.secondTextColor,
      upgradeBtnColor: config.upgradeBtnColor,
      expirationColor: config.expirationColor,
    },
    spaceLevelTag: {
      label: config.getLabel(title),
      logo: config.logo,
    },
  };
};

// Space three levels of different styles
export const SpaceLevelInfo: ISpaceLevelInfo = {
  bronze: getSpaceConfig('bronze', {
    title: t(Strings.bronze_grade),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.free_edition),
  }),
  free: getSpaceConfig('free', {
    title: t(Strings.subscribe_grade_free),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.free_edition),
  }),
  plus: getSpaceConfig('plus', {
    title: t(Strings.subscribe_grade_plus),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.paid_edition),
  }),
  starter: getSpaceConfig('starter', {
    title: t(Strings.subscribe_grade_starter),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.paid_edition),
  }),
  pro: getSpaceConfig('pro', {
    title: t(Strings.subscribe_grade_pro),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.paid_edition),
  }),
  dingtalk_base: getSpaceConfig('bronze', {
    title: t(Strings.dingtalk_base),
    titleTip: t(Strings.dingtalk_grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.free_edition),
  }),

  silver: getSpaceConfig('silver', {
    title: t(Strings.silver_grade),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  dingtalk_standard: getSpaceConfig('silver', {
    title: t(Strings.dingtalk_standard),
    titleTip: t(Strings.dingtalk_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  gold: getSpaceConfig('golden', {
    title: t(Strings.golden_grade),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  dingtalk_profession: getSpaceConfig('golden', {
    title: t(Strings.dingtalk_profession),
    titleTip: t(Strings.dingtalk_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  feishu_profession: getSpaceConfig('golden', {
    title: t(Strings.feishu_profession),
    titleTip: t(Strings.feishu_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  wecom_profession: getSpaceConfig('golden', {
    title: t(Strings.wecom_profession),
    titleTip: t(Strings.wecom_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  enterprise: getSpaceConfig('enterprise', {
    title: t(Strings.enterprise_edition),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  business: getSpaceConfig('enterprise', {
    title: t(Strings.subscribe_grade_business),
    titleTip: t(Strings.grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  dingtalk_enterprise: getSpaceConfig('enterprise', {
    title: t(Strings.dingtalk_enterprise),
    titleTip: t(Strings.dingtalk_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  wecom_base: getSpaceConfig('bronze', {
    title: t(Strings.wecom_base),
    titleTip: t(Strings.wecom_grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.free_edition),
  }),
  wecom_standard: getSpaceConfig('silver', {
    title: t(Strings.wecom_standard),
    titleTip: t(Strings.wecom_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  wecom_enterprise: getSpaceConfig('enterprise', {
    title: t(Strings.wecom_enterprise),
    titleTip: t(Strings.wecom_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  // Free version of Feishu
  feishu_base: getSpaceConfig('bronze', {
    title: t(Strings.feishu_base),
    titleTip: t(Strings.feishu_grade_desc),
    buttonText: t(Strings.upgrade),
    tagText: t(Strings.free_edition),
  }),
  // Standard version of Feishu
  feishu_standard: getSpaceConfig('silver', {
    title: t(Strings.feishu_standard),
    titleTip: t(Strings.feishu_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  // Enterprise version of Feishu
  feishu_enterprise: getSpaceConfig('enterprise', {
    title: t(Strings.feishu_enterprise),
    titleTip: t(Strings.feishu_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  private_cloud: getSpaceConfig('enterprise', {
    title: t(Strings.private_cloud),
    titleTip: t(Strings.company_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  appsumo_tier1: getSpaceConfig('enterprise', {
    title: 'AppSumo Tier 1',
    titleTip: t(Strings.app_sumo_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  appsumo_tier2: getSpaceConfig('enterprise', {
    title: 'AppSumo Tier 2',
    titleTip: t(Strings.app_sumo_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  appsumo_tier3: getSpaceConfig('enterprise', {
    title: 'AppSumo Tier 3',
    titleTip: t(Strings.app_sumo_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  appsumo_tier4: getSpaceConfig('enterprise', {
    title: 'AppSumo Tier 4',
    titleTip: t(Strings.app_sumo_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  appsumo_tier5: getSpaceConfig('enterprise', {
    title: 'AppSumo Tier 5',
    titleTip: t(Strings.app_sumo_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  'exclusive limited tier 1': getSpaceConfig('enterprise', {
    title: 'Exclusive Limited Tier 1',
    titleTip: t(Strings.exclusive_limit_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  'exclusive limited tier 2': getSpaceConfig('enterprise', {
    title: 'Exclusive Limited Tier 2',
    titleTip: t(Strings.exclusive_limit_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  'exclusive limited tier 3': getSpaceConfig('enterprise', {
    title: 'Exclusive Limited Tier 3',
    titleTip: t(Strings.exclusive_limit_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  'exclusive limited tier 4': getSpaceConfig('enterprise', {
    title: 'Exclusive Limited Tier 4',
    titleTip: t(Strings.exclusive_limit_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  'exclusive limited tier 5': getSpaceConfig('enterprise', {
    title: 'Exclusive Limited Tier 5',
    titleTip: t(Strings.exclusive_limit_plan_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
  atlas: getSpaceConfig('golden', {
    title: t(Strings.atlas),
    titleTip: t(Strings.atlas_grade_desc),
    buttonText: t(Strings.renew),
    tagText: t(Strings.paid_edition),
  }),
};

export const useLevelInfo = (level: ISpaceLevelType, expiration?: string | null) => {
  return useMemo(() => {
    const _level = level.toLocaleLowerCase();
    const info = SpaceLevelInfo[_level] || SpaceLevelInfo.bronze;
    info.levelCard.expiration = expiration || -1;
    return info;
  }, [level, expiration]);
};

export const isExclusiveLimitedProduct = (plan: string | undefined) => {
  if (typeof plan !== 'string') return false;
  return plan.toLowerCase().includes('exclusive limited tier');
};
