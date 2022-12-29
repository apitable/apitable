import { message } from 'antd';
import { ConfigOptions, ArgsProps } from 'antd/lib/message';
import WarningIcon from 'static/icon/common/common_icon_warning.svg';
import SuccessIcon from 'static/icon/common/common_icon_success.svg';
import ErrorIcon from 'static/icon/common/common_icon_error.svg';
import InfoIcon from 'static/icon/common/common_icon_default.svg';
import { t, Strings } from '@apitable/core';

message.config({
  top: 80,
});

type IMessageProps = ConfigOptions & {
  key?: string;
  content?: ArgsProps['content'];
  onClose?: ArgsProps['onClose'];
};
const duration = 3;
const success = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_success),
    duration,
    icon: <SuccessIcon />,
    ...props,
  };
  return message.success(config);
};
const error = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_fail),
    duration,
    icon: <ErrorIcon />,
    ...props,
  };
  return message.error(config);
};
const warning = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_warning),
    duration,
    icon: <WarningIcon />,
    ...props,
  };
  return message.warning(config);
};
const info = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_info),
    duration,
    icon: <InfoIcon />,
    ...props,
  };
  return message.info(config);
};
const loading = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.loading),
    ...props,
  };
  return message.loading(config);
};
const destroy = message.destroy;
export const Message = {
  info,
  success,
  error,
  warning,
  loading,
  destroy,
};

