import * as React from 'react';
import useRCNotification from 'rc-notification/lib/useNotification';
import {
  NotificationInstance as RCNotificationInstance,
  NoticeContent as RCNoticeContent,
  HolderReadyCallback as RCHolderReadyCallback,
} from 'rc-notification/lib/Notification';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import { INotificationInstance, IArgsProps } from '..';

export default function createUseNotification(
  getNotificationInstance: (
    args: IArgsProps,
    callback: (info: { prefixCls: string; instance: RCNotificationInstance }) => void,
  ) => void,
  getRCNoticeProps: (args: IArgsProps, prefixCls: string) => RCNoticeContent,
) {
  const useNotification = (): [INotificationInstance, React.ReactElement] => {
    // We can only get content by render
    let getPrefixCls: ConfigConsumerProps['getPrefixCls'];

    // We create a proxy to handle delay created instance
    let innerInstance: RCNotificationInstance | null = null;
    const proxy = {
      add: (noticeProps: RCNoticeContent, holderCallback?: RCHolderReadyCallback) => {
        innerInstance && innerInstance.component.add(noticeProps, holderCallback);
      },
    } as any;

    const [hookNotify, holder] = useRCNotification(proxy);

    function notify(args: IArgsProps) {
      const { prefixCls: customizePrefixCls } = args;
      const mergedPrefixCls = getPrefixCls('notification', customizePrefixCls);

      getNotificationInstance(
        {
          ...args,
          prefixCls: mergedPrefixCls,
        },
        ({ prefixCls, instance }) => {
          innerInstance = instance;
          hookNotify(getRCNoticeProps(args, prefixCls));
        },
      );
    }

    // Fill functions
    const hookApiRef = React.useRef<any>({});

    hookApiRef.current.open = notify;

    ['success', 'info', 'warning', 'error'].forEach(type => {
      hookApiRef.current[type] = (args: IArgsProps) =>
        hookApiRef.current.open({
          ...args,
          type,
        });
    });

    return [
      hookApiRef.current,
      (
        <ConfigConsumer key="holder">
          {(context: ConfigConsumerProps) => {
            ({ getPrefixCls } = context);
            return holder;
          }}
        </ConfigConsumer>
      ),
    ];
  };

  return useNotification;
}
