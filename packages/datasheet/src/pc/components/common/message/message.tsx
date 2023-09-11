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

import { message } from 'antd';
import { ArgsProps, ConfigOptions } from 'antd/lib/message';
import { Strings, t } from '@apitable/core';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarnCircleFilled } from '@apitable/icons';

message.config({
  top: 80,
  // maxCount: 1,
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
    icon: <CheckCircleFilled />,
    ...props,
  };
  return message.success(config);
};
const error = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_fail),
    duration,
    icon: <CloseCircleFilled />,
    ...props,
  };
  return message.error(config);
};
const warning = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_warning),
    duration,
    icon: <WarnCircleFilled />,
    ...props,
  };
  return message.warning(config);
};
const info = (props: IMessageProps) => {
  const config = {
    content: props.content || t(Strings.operate_info),
    duration,
    icon: <InfoCircleFilled />,
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
