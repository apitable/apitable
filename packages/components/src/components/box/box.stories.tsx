import styled from 'styled-components';
import React from 'react';
import { StoryType } from '../../stories/constants';
import { Box } from './index';

const COMPONENT_NAME = 'Box';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Box,
  title: TITLE,
};

export const TmpComponent = () => {
  const Card = styled(Box)({
    borderRadius: '4px',
    border: '1px solid #f6f6f6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, .125)',
    minHeight: '100px',
    padding: '16px'
  });
  return <Card>Card component</Card>;
};