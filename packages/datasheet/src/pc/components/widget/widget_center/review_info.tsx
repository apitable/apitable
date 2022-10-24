import { Avatar, Box, Divider, LinkButton, Modal, Space, Typography } from '@vikadata/components';
import { IWidgetPackage } from '@apitable/core';
import { store } from 'pc/store';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

type IReviewInfo = IWidgetPackage & {
  onClose?: () => void
};

export const ReviewInfo: React.FC<IReviewInfo> = (props) => {
  const {
    name,
    description,
    authorIcon,
    authorEmail,
    authorName,
    extras,
    version,
    onClose,
  } = props;
  const Title = () => (
    <Typography variant={'h6'} component={'div'}>
      {name}
      <Typography variant={'body4'} component={'span'}>{version}</Typography>
    </Typography>
  );
  return (
    <Modal
      title={<Title />}
      visible
      centered
      width={700}
      onCancel={() => onClose?.()}
      footer={null}
    >
      <Box display='flex'>
        <Box flex='1'>{description}</Box>
        <Divider orientation='vertical' />
        <Box width={'200px'}>
          <Space
            align='start'
            size={16}
            vertical
          >
            <Space align='start' size={6} vertical>
              <Box fontWeight='bold'>发布者</Box>
              <Space size={6}>
                <Avatar size='xxs' src={authorIcon} alt={authorName} />
                <Space>{authorName}</Space>
              </Space>
            </Space>
            <Space size={6}>
              <Space>Email: </Space>
              <Space>{authorEmail}</Space>
            </Space>
            <Box>
              <LinkButton href={extras.website} target='_blank'>website</LinkButton>
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

  root.render((
    <Provider store={store}>
      <ReviewInfo
        {...props}
        onClose={onModalClose}
      />
    </Provider>
  ));
};

