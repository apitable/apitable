import { colorVars } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import { EnterpriseFilled, GoldFilled, SilverFilled } from '@vikadata/icons';
import { ReactNode } from 'react';
import EnterPrise from 'static/icon/enterprise_bj@2x.png';
import GoldImg from 'static/icon/gold_banner@2x.png';
import SilverImg from 'static/icon/silver_bj@2x.png';

export interface ILevelInfo {
  level: string;
  levelName: string;
  levelPowerTitle: string;
  headBgSrc: ReactNode,
  levelIcon: ReactNode;
  activeLevelNameColor: string;
  normalLevelNameColor: string;
  cardSelectBg: string;
  rightFeatureListBg: string;
  seatNums: number[];
  activeColor: string;
  levelDesc: string[]
}

export const paySystemConfig = {
  SILVER: {
    level: 'SILVER',
    levelName: t(Strings.plan_model_choose_space_level, { space_level: t(Strings.silver) }),
    levelPowerTitle: t(Strings.plan_model_benefits_title, { space_level: t(Strings.silver) }),
    headBgSrc: SilverImg,
    levelIcon: <SilverFilled size={24} />,
    activeLevelNameColor: colorVars.indigo[400],
    normalLevelNameColor: '#636363', // No theme switching, fixed color values
    activeColor: colorVars.indigo[400],
    cardSelectBg: colorVars.extraLightIndigo,
    rightFeatureListBg: colorVars.extraLightIndigo,
    seatNums: [2, 5, 10, 20, 30, 40, 50],
    levelDesc: t(Strings.plan_model_benefits_sliver).split(';').filter(item => Boolean(item))
  },
  GOLD: {
    level: 'GOLD',
    levelName: t(Strings.plan_model_choose_space_level, { space_level: t(Strings.gold) }),
    levelPowerTitle: t(Strings.plan_model_benefits_title, { space_level: t(Strings.gold) }),
    headBgSrc: GoldImg,
    levelIcon: <GoldFilled size={24} />,
    activeLevelNameColor: colorVars.orange[500],
    normalLevelNameColor: '#636363',
    cardSelectBg: colorVars.extraLightOrange,
    rightFeatureListBg: colorVars.extraLightOrange,
    seatNums: [2, 5, 10, 20, 30, 40, 50],
    activeColor: colorVars.orange[500],
    levelDesc: t(Strings.plan_model_benefits_gold).split(';').filter(item => Boolean(item))
  },
  ENTERPRISE: {
    level: 'ENTERPRISE',
    levelName: t(Strings.plan_model_choose_space_level, { space_level: t(Strings.enterprise) }),
    levelPowerTitle: t(Strings.plan_model_benefits_title, { space_level: t(Strings.enterprise) }),
    headBgSrc: EnterPrise,
    levelIcon: <EnterpriseFilled size={24} />,
    cardSelectBg: colorVars.extraLightOrange,
    rightFeatureListBg: colorVars.extraLightOrange,
    activeLevelNameColor: colorVars.indigo[600],
    normalLevelNameColor: '#636363',
    seatNums: [2, 5, 10, 20, 30, 40, 50],
    activeColor: colorVars.indigo[600],
    levelDesc: [
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
      '彩虹标签高级功能',
    ]
  }
};

export const monthMap = {
  1: t(Strings.one_month),
  6: t(Strings.six_months),
  12: t(Strings.one_year),
};

export enum SubscribePageType {
  Subscribe,
  Renewal,
  Upgrade
}
