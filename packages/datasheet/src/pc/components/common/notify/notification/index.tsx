import * as React from 'react';
import Notification from 'rc-notification';
import { NotificationInstance as RCNotificationInstance } from 'rc-notification/lib/Notification';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classNames from 'classnames';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import createUseNotification from './hooks/useNotification';

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type CustomNotificationPlacement = NotificationPlacement | 'bottom';

export type IconType = 'success' | 'info' | 'error' | 'warning';

const notificationInstance: {
  [key: string]: Promise<RCNotificationInstance>;
} = {};
let defaultDuration = 4.5;
let defaultTop = 24;
let defaultBottom = 24;
let defaultPrefixCls = 'ant-notification';
let defaultPlacement: CustomNotificationPlacement = 'topRight';
let defaultGetContainer: () => HTMLElement;
let defaultCloseIcon: React.ReactNode;

export interface IConfigProps {
  top?: number;
  bottom?: number;
  duration?: number;
  prefixCls?: string;
  placement?: CustomNotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
  rtl?: boolean;
}

let rtl = false;
function setNotificationConfig(options: IConfigProps) {
  const { duration, placement, bottom, top, getContainer, closeIcon, prefixCls } = options;
  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  } else if (options.rtl) {
    defaultPlacement = 'topLeft';
  }
  if (bottom !== undefined) {
    defaultBottom = bottom;
  }
  if (top !== undefined) {
    defaultTop = top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
}

function getPlacementStyle(
  placement: CustomNotificationPlacement,
  top: number = defaultTop,
  bottom: number = defaultBottom,
) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom,
      };
      break;
    case 'bottom':
      style = {
        left: 0,
        bottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom,
      };
      break;
  }
  return style;
}

function getNotificationInstance(
  args: IArgsProps,
  callback: (info: { prefixCls: string; instance: RCNotificationInstance }) => void,
) {
  const {
    placement = defaultPlacement,
    top,
    bottom,
    getContainer = defaultGetContainer,
    closeIcon = defaultCloseIcon,
  } = args;
  const outerPrefixCls = args.prefixCls || defaultPrefixCls;
  const prefixCls = `${outerPrefixCls}-notice`;

  const cacheKey = `${outerPrefixCls}-${placement}`;
  const cacheInstance = notificationInstance[cacheKey];
  if (cacheInstance) {
    Promise.resolve(cacheInstance).then(instance => {
      callback({ prefixCls, instance });
    });

    return;
  }

  const closeIconToRender = (
    <span className={`${outerPrefixCls}-close-x`}>
      {closeIcon || <CloseOutlined className={`${outerPrefixCls}-close-icon`} />}
    </span>
  );

  const notificationClass = classNames(`${outerPrefixCls}-${placement}`, {
    [`${outerPrefixCls}-rtl`]: rtl === true,
  });

  notificationInstance[cacheKey] = new Promise(resolve => {
    Notification.newInstance(
      {
        prefixCls: outerPrefixCls,
        className: notificationClass,
        style: getPlacementStyle(placement, top, bottom),
        getContainer,
        closeIcon: closeIconToRender,
      },
      notification => {
        resolve(notification);
        callback({
          prefixCls,
          instance: notification,
        });
      },
    );
  });
}

const typeToIcon = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
};

export interface IArgsProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  btn?: React.ReactNode;
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  icon?: React.ReactNode;
  placement?: CustomNotificationPlacement;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  readonly type?: IconType;
  onClick?: () => void;
  top?: number;
  bottom?: number;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
}

function getRCNoticeProps(args: IArgsProps, prefixCls: string) {
  const duration = args.duration === undefined ? defaultDuration : args.duration;

  let iconNode: React.ReactNode = null;
  if (args.icon) {
    iconNode = <span className={`${prefixCls}-icon`}>{args.icon}</span>;
  } else if (args.type) {
    iconNode = React.createElement(typeToIcon[args.type] || null, {
      className: `${prefixCls}-icon ${prefixCls}-icon-${args.type}`,
    });
  }

  const autoMarginTag =
    !args.description && iconNode ? (
      <span className={`${prefixCls}-message-single-line-auto-margin`} />
    ) : null;

  return {
    content: (
      <div className={iconNode ? `${prefixCls}-with-icon` : ''}>
        {iconNode}
        <div className={`${prefixCls}-message`}>
          {autoMarginTag}
          {args.message}
        </div>
        <div className={`${prefixCls}-description`}>{args.description}</div>
        {args.btn ? <span className={`${prefixCls}-btn`}>{args.btn}</span> : null}
      </div>
    ),
    duration,
    closable: true,
    onClose: args.onClose,
    onClick: args.onClick,
    key: args.key,
    style: args.style || {},
    className: args.className,
  };
}

const api: any = {
  open: (args: IArgsProps) => {
    getNotificationInstance(args, ({ prefixCls, instance }) => {
      instance.notice(getRCNoticeProps(args, prefixCls) as any);
    });
  },
  close(key: string) {
    Object.keys(notificationInstance).forEach(cacheKey =>
      Promise.resolve(notificationInstance[cacheKey]).then(instance => {
        instance.removeNotice(key);
      }),
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach(cacheKey => {
      Promise.resolve(notificationInstance[cacheKey]).then(instance => {
        instance.destroy();
      });
      delete notificationInstance[cacheKey]; // lgtm[js/missing-await]
    });
  },
};

['success', 'info', 'warning', 'error'].forEach(type => {
  api[type] = (args: IArgsProps) =>
    api.open({
      ...args,
      type,
    });
});

api.warn = api.warning;
api.useNotification = createUseNotification(getNotificationInstance, getRCNoticeProps as any);

export interface INotificationInstance {
  success(args: IArgsProps): void;
  error(args: IArgsProps): void;
  info(args: IArgsProps): void;
  warning(args: IArgsProps): void;
  open(args: IArgsProps): void;
}

export interface INotificationApi extends INotificationInstance {
  warn(args: IArgsProps): void;
  close(key: string): void;
  config(options: IConfigProps): void;
  destroy(): void;

  // Hooks
  useNotification: () => [INotificationInstance, React.ReactElement];
}

export default api as INotificationApi;
