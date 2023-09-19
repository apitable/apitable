import React from 'react';
import styled from 'styled-components';
import { IIconProps, makeIcon } from '@apitable/icons';

const LinkIcon: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => (
    <>
      <rect x="7.5" width="1" height="20" fill="#907FF0" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        // eslint-disable-next-line max-len
        d="M9.21012 28.4701C8.72054 29.2535 7.57971 29.2534 7.09013 28.4701L2.99225 21.9135C2.4719 21.081 3.07046 20.001 4.05225 20.001L12.248 20.001C13.2298 20.001 13.8283 21.081 13.308 21.9135L9.21012 28.4701Z"
        fill="#907FF0"
      />
      <rect x="7.5" y="28" width="1" height="20" fill="#907FF0" />
    </>
  ),
  name: 'link_icon',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  width: '16',
  height: '48',
  viewBox: '0 0 16 48',
});

export const StyledLinkIcon = styled(LinkIcon)`
  width: 16px !important;
  height: 48px !important;
`;
const AddIcon: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => (
    <>
      <rect x="7.5" width="1" height="18" fill="#907FF0" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        // eslint-disable-next-line max-len
        d="M8 17C4.13401 17 1 20.134 1 24C1 27.866 4.13401 31 8 31C11.866 31 15 27.866 15 24C15 20.134 11.866 17 8 17ZM8 20.25C8.41421 20.25 8.75 20.5858 8.75 21V23.25H11C11.4142 23.25 11.75 23.5858 11.75 24C11.75 24.4142 11.4142 24.75 11 24.75H8.75V27C8.75 27.4142 8.41421 27.75 8 27.75C7.58579 27.75 7.25 27.4142 7.25 27V24.75H5C4.58579 24.75 4.25 24.4142 4.25 24C4.25 23.5858 4.58579 23.25 5 23.25H7.25V21C7.25 20.5858 7.58579 20.25 8 20.25Z"
        fill="#907FF0"
      />
      <rect x="7.5" y="30" width="1" height="18" fill="#907FF0" />
    </>
  ),
  name: 'add_icon',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  width: '16',
  height: '48',
  viewBox: '0 0 16 48',
});

export const StyledAdd = styled(AddIcon)`
  width: 16px !important;
  height: 48px !important;
`;
