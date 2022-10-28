import { lightColors } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import * as React from 'react';
import PayingModalHeaderCapacityBg from 'static/icon/space/space_img_capacitybj.png';
import PayingModalHeaderDefaultBg from 'static/icon/space/space_img_silverbj.png';
import { PrivilegeList } from '../stateless_ui';
import { Capacity } from './capacity';
import { GradesChecklist } from './grades_checklist';
import { ICheckoutSessionConfig } from './interface';
import { Renewal } from './renewal';
import { Seats } from './seats';

export enum CheckoutSessionType {
  GradesChecklist = 'GradesChecklist',
  Seats = 'Seats',
  Renewal = 'Renewal',
  Capacity = 'Capacity',
}

export const CheckoutSessionConfig: { [key in CheckoutSessionType]: ICheckoutSessionConfig } = {
  [CheckoutSessionType.GradesChecklist]: {
    modalHeaderTitle: '升级你的空间站',
    modalHeaderMessage: '超值白银级空间站来袭，2021年助你弯道超车',
    modalHeaderBg: PayingModalHeaderDefaultBg,
    themeColor: lightColors.primaryColor,
    contentRight: <PrivilegeList {...JSON.parse(t(Strings.privilege_list_of_sliver))} themeColor={lightColors.primaryColor} />,
    Main: GradesChecklist,
  },
  [CheckoutSessionType.Seats]: {
    modalHeaderTitle: '提高成员数上限',
    modalHeaderMessage: '超值白银级空间站来袭，2021年助你弯道超车',
    modalHeaderBg: PayingModalHeaderDefaultBg,
    themeColor: lightColors.primaryColor,
    contentRight: <PrivilegeList {...JSON.parse(t(Strings.privilege_list_of_sliver))} themeColor={lightColors.primaryColor} />,
    Main: Seats,
  },
  [CheckoutSessionType.Renewal]: {
    modalHeaderTitle: '空间站等级续费',
    modalHeaderMessage: '超值白银级空间站来袭，2021年助你弯道超车',
    modalHeaderBg: PayingModalHeaderDefaultBg,
    themeColor: lightColors.primaryColor,
    contentRight: <PrivilegeList {...JSON.parse(t(Strings.privilege_list_of_sliver))} themeColor={lightColors.primaryColor} />,
    Main: Renewal,
  },
  [CheckoutSessionType.Capacity]: {
    modalHeaderTitle: '新购容量包',
    modalHeaderMessage: '超值白银级空间站来袭，2021年助你弯道超车',
    modalHeaderBg: PayingModalHeaderCapacityBg,
    themeColor: lightColors.teal[500],
    contentRight: <PrivilegeList {...JSON.parse(t(Strings.privilege_list_of_sliver))} themeColor={lightColors.teal[500]} />,
    Main: Capacity,
  },
};
