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