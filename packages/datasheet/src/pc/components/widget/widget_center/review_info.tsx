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

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Avatar, Box, Divider, LinkButton, Modal, Space, Typography } from '@apitable/components';
import { IWidgetPackage, Strings, t } from '@apitable/core';
import { store } from 'pc/store';

type IReviewInfo = IWidgetPackage & {
  onClose?: () => void;
};

export const ReviewInfo: React.FC<React.PropsWithChildren<IReviewInfo>> = (props) => {
  const { name, description, authorIcon, authorEmail, authorName, extras, version, onClose } = props;
  const Title = () => (
    <Typography variant={'h6'} component={'div'}>
      {name}
      <Typography variant={'body4'} component={'span'}>
        {version}
      </Typography>
    </Typography>
  );
  return (
    <Modal title={<Title />} visible centered width={700} onCancel={() => onClose?.()} footer={null}>
      <Box display="flex">
        <Box flex="1">{description}</Box>
        <Divider orientation="vertical" />
        <Box width={'200px'}>
          <Space align="start" size={16} vertical>
            <Space align="start" size={6} vertical>
              <Box fontWeight="bold">{t(Strings.widget_center_publisher)}</Box>
              <Space size={6}>
                <Avatar size="xxs" src={authorIcon} alt={authorName} />
                <Space>{authorName}</Space>
              </Space>
            </Space>
            <Space size={6}>
              <Space>Email: </Space>
              <Space>{authorEmail}</Space>
            </Space>
            <Box>
              <LinkButton href={extras.website} target="_blank">
                website
              </LinkButton>
            </Box>
          </Space>
        </Box>
      </Box>
    </Modal>
  );
};

export const expandReviewInfo = (props: IReviewInfo) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    props?.onClose && props.onClose();
  };

  root.render(
    <Provider store={store}>
      <ReviewInfo {...props} onClose={onModalClose} />
    </Provider>,
  );
};
