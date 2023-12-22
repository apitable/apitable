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

import classNames from 'classnames';
import dayjs from 'dayjs';
import Calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import parser, { HTMLReactParserOptions } from 'html-react-parser';
import { isArray } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  getTimeZone,
  getTimeZoneAbbrByUtc,
  IFromUserInfo,
  INoticeDetail,
  integrateCdnHost,
  ISpaceBasicInfo,
  ISpaceInfo,
  NOTIFICATION_ID,
  Settings,
  Strings,
  SystemConfig,
  t,
} from '@apitable/core';
import { getUserTimeZone } from '@apitable/core/dist/modules/user/store/selectors/user';
import { UnitTag } from 'pc/components/catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { UserCardTrigger } from 'pc/components/common/user_card/user_card_trigger';
import { NoticeTemplatesConstant, NotificationTemplates } from 'pc/components/notification/utils';
import { store } from 'pc/store';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { getSocialWecomUnitName, isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const ERROR_STR = '[ERROR STR]';
dayjs.extend(relativeTime);
dayjs.extend(Calendar);

export enum TemplateKeyword {
  UserName = 'userName',
  MemberName = 'memberName',
  InvolveMemberArr = 'involveMemberArr',
  SpaceName = 'spaceName',
  OldSpaceName = 'oldSpaceName',
  NewSpaceName = 'newSpaceName',
  Times = 'times',
  NodeName = 'nodeName',
  TeamName = 'teamName',
  ActivityName = 'activityName',
  ActionName = 'actionName',
  Count = 'count',
  FieldName = 'fieldName',
  RecordTitle = 'recordTitle',
  Usage = 'usage',
  Specification = 'specification',
  WidgetName = 'widgetName',
  PlanName = 'planName',
  ExpireAt = 'expireAt',
  TaskExpireAt = 'taskExpireAt',
  PayFee = 'payFee',
  FeatureName = 'featureName',
  NickName = 'nickName',
  OldDisplayValue = 'oldDisplayValue',
  NewDisplayValue = 'newDisplayValue',
  Content = 'content',
  Number = 'number',
  RoleName = 'roleName',
  AutomationRunEndAt = 'endAt',
  AutomationName = 'automationName',
}

export enum NotifyType {
  Record = 'record',
  Member = 'member',
  Space = 'space',
  System = 'system',
}

enum MemberTypeInNotice {
  IsMember = 1,
  IsDeleted = 2,
  IsVisitor = 3,
}

enum NotifyStatusType {
  CheckPending = 0,
  Agree = 1,
  Reject = 2,
  Invalid = 3, // Reason for Invalid: 0 - email invitation, 1 - address book import, 2 - invitation link
}

export const JoinMsgApplyStatus: FC<React.PropsWithChildren<{ status: number }>> = ({ status }): React.ReactElement => {
  switch (status) {
    case NotifyStatusType.Agree: {
      return <div className={classNames(styles.processRes, styles.info)}>{t(Strings.agreed)}</div>;
    }
    case NotifyStatusType.Reject: {
      return <div className={classNames(styles.processRes, styles.red)}>{t(Strings.rejected)}</div>;
    }
    case NotifyStatusType.Invalid: {
      return <div className={styles.processRes}>{t(Strings.processed)}</div>;
    }
    default: {
      return <></>;
    }
  }
};

interface IRenderNoticeBodyOptions {
  pureString?: boolean;
  spaceInfo?: ISpaceBasicInfo | null;
}

const triggerBase = {
  popupClassName: styles.triggerInNotice,
  popupAlign: {
    points: ['tl', 'bl'],
    offset: [0, 8],
    overflow: { adjustX: true, adjustY: true },
  },
  scrollTarget: `#${NOTIFICATION_ID.NOTICE_LIST_WRAPPER}`,
  spareSrc: integrateCdnHost(Settings.datasheet_unlogin_user_avatar.value),
};

const unitTagBase = {
  deletable: false,
  isTeam: false,
};
const triggerWrapBase = {
  onClick: (e: React.MouseEvent) => {
    e.stopPropagation();
  },
  style: { display: 'inline-block' },
  className: styles.triggerWrapBase,
};
const keyWordAddClass = (keyword: string) => {
  return `<a class="${keyword}"></a>`;
};
const renderUser = (info: IFromUserInfo, spaceName: string) => {
  return (
    <div {...triggerWrapBase}>
      <UserCardTrigger
        {...triggerBase}
        memberId={''}
        userId={info.uuid}
        spaceName={spaceName}
        spareName={info.userName || t(Strings.guests_per_space)}
        spareSrc={info.avatar}
        permissionVisible={false}
      >
        <div className={styles.unitTagWrap}>
          <UnitTag
            {...unitTagBase}
            unitId={info.uuid}
            avatar={info.avatar}
            avatarColor={info.avatarColor}
            nickName={info.nickName}
            name={info.userName || t(Strings.guests_per_space)}
          />
        </div>
      </UserCardTrigger>
    </div>
  );
};
export const renderMember = (info: IFromUserInfo, spaceName: string, spaceInfo?: ISpaceBasicInfo | null) => {
  const isDeleted = Boolean(info.playerType === MemberTypeInNotice.IsDeleted);
  const unitTagWrapClasses = classNames(styles.unitTagWrap, { [styles.isLeave]: isDeleted });
  if (isDeleted) {
    return (
      <div className={unitTagWrapClasses}>
        <UnitTag
          {...unitTagBase}
          unitId={info.memberId}
          avatar={info.avatar}
          avatarColor={info.avatarColor}
          nickName={info.nickName}
          name={info.memberName || info.userName || t(Strings.unnamed)}
        />
      </div>
    );
  }
  const title = spaceInfo
    ? getSocialWecomUnitName?.({
      name: info?.memberName,
      isModified: info?.isMemberNameModified,
      spaceInfo,
    }) || info?.memberName
    : undefined;
  return (
    <div {...triggerWrapBase}>
      <UserCardTrigger
        {...triggerBase}
        memberId={info.memberId}
        spaceName={spaceName}
        spareName={info.memberName || info.userName || t(Strings.guests_per_space)}
        permissionVisible={false}
        avatarProps={{
          id: info.memberId || '',
          title: info.memberName,
          src: info.avatar,
        }}
      >
        <div className={unitTagWrapClasses}>
          <UnitTag
            {...unitTagBase}
            unitId={info.memberId}
            avatar={info.avatar}
            avatarColor={info.avatarColor}
            nickName={info.nickName}
            title={title}
            name={info.memberName || info.userName || t(Strings.unnamed)}
          />
        </div>
      </UserCardTrigger>
    </div>
  );
};

export const getNoticeUrlParams = (data: INoticeDetail) => {
  const env = getEnvVariables();
  const templateConfig = SystemConfig.notifications.templates[data.templateId];
  const configPathname = templateConfig?.url;
  const spaceId = data.notifyBody?.space?.spaceId;
  const nodeId = data.notifyBody?.node?.nodeId;
  const viewId = data.notifyBody?.extras?.viewId;
  const dataRecordId = data.notifyBody?.extras?.recordId;
  const recordIds = data.notifyBody?.extras?.recordIds || (dataRecordId ? [dataRecordId] : undefined);
  const recordId = recordIds && isArray(recordIds) ? recordIds[0] : '';
  const toastUrl = data.templateId === 'new_user_welcome_notify' ? env.NEW_USER_WELCOME_NOTIFY_URL : data.notifyBody.extras?.toast?.url;
  const notifyId = data.id;
  const roleName = data.notifyBody.extras?.roleName;

  return { spaceId, nodeId, viewId, recordId, configPathname, toastUrl, notifyType: data.notifyType, recordIds, notifyId, roleName };
};

// Get the message body - whether the text displayed in the message comes from the config configuration, if not, then it is ws message body to get
export const getMsgText = (data: INoticeDetail) => {
  const templateConfig = SystemConfig.notifications.templates[data.templateId];

  switch (data.templateId) {
    case NoticeTemplatesConstant.common_system_notify:
    case NoticeTemplatesConstant.common_system_notify_web:
    case NoticeTemplatesConstant.web_publish:
    case NoticeTemplatesConstant.server_pre_publish: {
      return data.notifyBody?.extras?.toast?.msg || data.notifyBody?.extras?.toast?.content || 'data is null';
    }
    default: {
      const formatString = templateConfig?.format_string;
      const stringId = typeof formatString === 'string' ? formatString : formatString?.[0];
      return t(Strings[stringId]) !== ERROR_STR ? t(Strings[stringId]) : t(Strings.unresolved_message);
    }
  }
};

// spaceName is the space to which the current notification belongs
export const renderNoticeBody = (data: INoticeDetail, options?: IRenderNoticeBodyOptions) => {
  const state = store.getState();
  const userTimeZone = getUserTimeZone(state);
  const timeZone = userTimeZone || getTimeZone();
  const abbr = getTimeZoneAbbrByUtc(timeZone)!;
  const pureString = options ? options.pureString : false;
  const spaceInfo = options ? options.spaceInfo : null;

  const templateConfig = SystemConfig.notifications.templates[data.templateId];
  if (!templateConfig) {
    return 'this message is not config';
  }
  const template = getMsgText(data);
  const nodeName = data.notifyBody.extras?.nodeName || data.notifyBody.node?.nodeName;
  const times = data.notifyBody.extras?.times || 0;
  const teamName = data.notifyBody.extras && data.notifyBody.extras.teamName;
  const oldSpaceName = data.notifyBody.extras && data.notifyBody.extras.oldSpaceName;
  const newSpaceName = data.notifyBody.extras && data.notifyBody.extras.newSpaceName;
  const involveMemberArr = data.notifyBody.extras?.involveMemberDetail || [];
  const activityName = data.notifyBody.extras && data.notifyBody.extras.activityName;
  const actionName = (data.notifyBody.extras && data.notifyBody.extras.actionName) || '奖励';
  const count = (data.notifyBody.extras && data.notifyBody.extras.count) || 0;
  const fieldName = data.notifyBody.extras?.fieldName;
  const recordTitle = data.notifyBody.extras?.recordTitle || t(Strings.record_unnamed);
  const usage = data.notifyBody.extras?.usage;
  const specification = data.notifyBody.extras?.specification;
  const widgetName = data.notifyBody.extras?.widgetName;
  const planName = data.notifyBody.extras?.planName;
  const payFee = data.notifyBody.extras?.payFee;
  const expireAt = data.notifyBody.extras?.expireAt;
  const taskExpireAt = data.notifyBody.extras?.taskExpireAt;
  const featureName =
    data.notifyBody.extras?.featureKey && t(Strings[SystemConfig.test_function?.[data.notifyBody.extras?.featureKey]?.feature_name]);
  const nickName = data.notifyBody.extras?.nickName;
  const oldDisplayValue = data.notifyBody.extras?.oldDisplayValue;
  const newDisplayValue = data.notifyBody.extras?.newDisplayValue;
  const content = data.notifyBody.extras?.content;
  const number = data.notifyBody.extras?.number || 0;
  const roleName = data.notifyBody.extras?.roleName;
  const automationName = data.notifyBody.extras?.automationName;
  const automationRunEndAt = data.notifyBody.extras?.endAt;

  const parseOptions: HTMLReactParserOptions = {
    replace: ({ attribs }) => {
      if (!attribs) {
        return;
      }
      switch (attribs.class) {
        case TemplateKeyword.MemberName: {
          if (!data.fromUser) {
            return;
          }
          return renderMember(data.fromUser, data.notifyBody.space.spaceName, spaceInfo);
        }
        case TemplateKeyword.UserName: {
          if (!data.fromUser) {
            return;
          }
          return renderUser(data.fromUser, data.notifyBody.space.spaceName);
        }
        case TemplateKeyword.InvolveMemberArr: {
          if (!involveMemberArr || involveMemberArr.length === 0) {
            return;
          }
          const userList = involveMemberArr.map((item: IFromUserInfo) => renderMember(item, data.notifyBody.space.spaceName, spaceInfo));
          return <>{userList}</>;
        }
        case TemplateKeyword.SpaceName: {
          return <b>{data.notifyBody.space.spaceName}</b>;
        }
        case TemplateKeyword.OldSpaceName: {
          return <b>{oldSpaceName}</b>;
        }
        case TemplateKeyword.NewSpaceName: {
          return <b>{newSpaceName}</b>;
        }
        case TemplateKeyword.Times: {
          return (
            <>
              {t(Strings.records_of_count, {
                count: times,
              })}
            </>
          );
        }
        case TemplateKeyword.NodeName: {
          return <b>{nodeName}</b>;
        }
        case TemplateKeyword.TeamName: {
          return <>{teamName}</>;
        }
        case TemplateKeyword.ActivityName: {
          return <b>{activityName}</b>;
        }
        case TemplateKeyword.ActionName: {
          return <>{actionName}</>;
        }
        case TemplateKeyword.Count: {
          return <b> {count} </b>;
        }
        case TemplateKeyword.FieldName: {
          return <b>{fieldName}</b>;
        }
        case TemplateKeyword.RecordTitle: {
          return <b>{recordTitle}</b>;
        }
        case TemplateKeyword.Usage: {
          return <b>{usage}</b>;
        }
        case TemplateKeyword.Specification: {
          return <b>{specification}</b>;
        }
        case TemplateKeyword.WidgetName: {
          return <b>{widgetName}</b>;
        }
        case TemplateKeyword.PlanName: {
          return <b>{planName}</b>;
        }
        case TemplateKeyword.PayFee: {
          return <b>&nbsp;{payFee}</b>;
        }
        case TemplateKeyword.ExpireAt: {
          return (
            <b>
              &nbsp;{dayjs.tz(Number(expireAt)).tz(timeZone).format('YYYY-MM-DD')}({abbr})
            </b>
          );
        }
        case TemplateKeyword.TaskExpireAt: {
          return (
            <b>
              &nbsp;{dayjs.tz(Number(taskExpireAt)).tz(timeZone).format('YYYY-MM-DD HH:mm')}({abbr})
            </b>
          );
        }
        case TemplateKeyword.FeatureName: {
          return <b>{featureName}</b>;
        }
        case TemplateKeyword.NickName: {
          return renderUser(data.fromUser, data.notifyBody.space.spaceName);
        }
        case TemplateKeyword.OldDisplayValue: {
          return <b>{oldDisplayValue}</b>;
        }
        case TemplateKeyword.NewDisplayValue: {
          return <b>{newDisplayValue}</b>;
        }
        case TemplateKeyword.Content: {
          return <b>{content}</b>;
        }
        case TemplateKeyword.Number: {
          return <b>{number}</b>;
        }
        case TemplateKeyword.RoleName: {
          return <b>{roleName}</b>;
        }
        case TemplateKeyword.AutomationRunEndAt: {
          return (
            <b>
              &nbsp;{dayjs.tz(Number(automationRunEndAt)).tz(timeZone).format('YYYY-MM-DD HH:mm')}({abbr})
            </b>
          );
        }
        case TemplateKeyword.AutomationName: {
          return <b>{automationName}</b>;
        }
        default:
          return;
      }
    },
  };
  if (pureString) {
    const userList = involveMemberArr.map((item: IFromUserInfo) => item.memberName || t(Strings.unnamed));
    return template
      .replace(keyWordAddClass(TemplateKeyword.MemberName), data?.fromUser?.memberName)
      .replace(keyWordAddClass(TemplateKeyword.UserName), data?.fromUser?.userName)
      .replace(keyWordAddClass(TemplateKeyword.InvolveMemberArr), userList.join('、'))
      .replace(keyWordAddClass(TemplateKeyword.SpaceName), `${data.notifyBody.space.spaceName}`)
      .replace(keyWordAddClass(TemplateKeyword.OldSpaceName), `${oldSpaceName}`)
      .replace(keyWordAddClass(TemplateKeyword.NewSpaceName), `${newSpaceName}`)
      .replace(keyWordAddClass(TemplateKeyword.Times), t(Strings.records_of_count, { count: times }))
      .replace(keyWordAddClass(TemplateKeyword.NodeName), `${nodeName}`)
      .replace(keyWordAddClass(TemplateKeyword.TeamName), `${teamName}`)
      .replace(keyWordAddClass(TemplateKeyword.ActivityName), `${activityName}`)
      .replace(keyWordAddClass(TemplateKeyword.ActionName), `${actionName}`)
      .replace(keyWordAddClass(TemplateKeyword.Count), count.toString())
      .replace(keyWordAddClass(TemplateKeyword.FieldName), `${fieldName}`)
      .replace(keyWordAddClass(TemplateKeyword.RecordTitle), `${recordTitle || t(Strings.record_unnamed)}`)
      .replace(keyWordAddClass(TemplateKeyword.Usage), `${usage}`)
      .replace(keyWordAddClass(TemplateKeyword.Specification), `${specification}`)
      .replace(keyWordAddClass(TemplateKeyword.WidgetName), `${widgetName}`)
      .replace(keyWordAddClass(TemplateKeyword.PlanName), planName)
      .replace(keyWordAddClass(TemplateKeyword.PayFee), payFee)
      .replace(keyWordAddClass(TemplateKeyword.FeatureName), featureName)
      .replace(keyWordAddClass(TemplateKeyword.ExpireAt), dayjs.tz(Number(expireAt)).format('YYYY-MM-DD'))
      .replace(keyWordAddClass(TemplateKeyword.TaskExpireAt), dayjs.tz(Number(taskExpireAt)).format('YYYY-MM-DD HH:mm'))
      .replace(keyWordAddClass(TemplateKeyword.NickName), nickName)
      .replace(keyWordAddClass(TemplateKeyword.OldDisplayValue), oldDisplayValue)
      .replace(keyWordAddClass(TemplateKeyword.NewDisplayValue), newDisplayValue)
      .replace(keyWordAddClass(TemplateKeyword.Content), content)
      .replace(keyWordAddClass(TemplateKeyword.Number), number)
      .replace(keyWordAddClass(TemplateKeyword.RoleName), roleName)
      .replace(keyWordAddClass(TemplateKeyword.AutomationName), automationName)
      .replace(keyWordAddClass(TemplateKeyword.AutomationRunEndAt), dayjs.tz(Number(automationRunEndAt)).format('YYYY-MM-DD HH:mm'));
  }
  return parser(template, parseOptions);
};

// Determine if the message type is someone's application to join the space
export const isAskForJoiningMsg = (data: INoticeDetail): boolean => {
  switch (data.templateId) {
    case NoticeTemplatesConstant.space_join_apply: {
      return true;
    }
    default: {
      return false;
    }
  }
};
// Determine if the message type is the type that will not jump when the card is clicked
export const canJumpWhenClickCard = (data: INoticeDetail): boolean => {
  const info = NotificationTemplates[data.templateId];
  return info && info.hasOwnProperty('can_jump') && Boolean(NotificationTemplates[data.templateId]['can_jump']);
};

export const commentContentFormat = (commentContent: string, spaceInfo?: ISpaceInfo | ISpaceBasicInfo | null) => {
  let content = commentContent;
  if (isSocialWecom?.(spaceInfo) && commentContent && spaceInfo) {
    const contentMatchArr = commentContent.match(/@(\$userName=)[a-zA-Z0-9-_]+?(\$)/g);
    contentMatchArr?.forEach((matchString) => {
      const name = matchString.replace(/(@(\$userName=))|(\$)/g, '');
      const title =
        getSocialWecomUnitName?.({
          name,
          isModified: false,
          spaceInfo,
        }) || name;
      // Convert the @$userName=wpOhr1DQAAwS6hkj_EMauEI4ljF-nAgQ$ format to the Enterprise Micro component
      content = content.replace(matchString, `${typeof title === 'string' ? title : '@' + ReactDOMServer.renderToStaticMarkup(title)}`);
    });
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return content;
};
