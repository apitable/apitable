
// https://storybook.js.org/docs/react/essentials/controls

import React from 'react';
import { LockOutlined, ShareFilled, RankFilled, WebsiteOutlined } from '@vikadata/icons';

export const iconComponents = {
  LockOutlined: <LockOutlined currentColor />,
  ShareFilled: <ShareFilled currentColor />,
  RankFilled: <RankFilled currentColor />,
  WebsiteOutlined: <WebsiteOutlined currentColor />,
};

export const iconArg = {
  options: ['LockOutlined', 'ShareFilled', 'RankFilled', 'WebsiteOutlined'],
  mapping: iconComponents,
};

export const icons = {
  LockOutlined,
  ShareFilled,
  RankFilled,
  WebsiteOutlined,
};

export const iconPrimaryArg = {
  options: ['LockOutlined', 'ShareFilled', 'RankFilled', 'WebsiteOutlined'],
  mapping: icons,
};