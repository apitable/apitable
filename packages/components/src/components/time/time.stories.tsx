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

import React, { FC, useState } from 'react';
import { StoryType } from '../../stories/constants';
import { NextTimePreview } from './preview';
import { Timing } from './timing';

const COMPONENT_NAME = 'Time';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    content: 'Scanner for decks of cards with bar codes printed on card edges',
  }
};

export const NextTime: FC = () => <><NextTimePreview title={'Preview next 5 execution times'}
  times={[new Date(), new Date(), new Date(), new Date(), new Date()]}
/></>;

export const TimingHour : FC = () => {
  const [state, setState] = useState({
    hour: 1,
  });

  // @ts-ignore
  return <Timing interval={'hour'} value={state} onUpdate={setState} readonly={false}/>;
};

export const TimingDay : FC = () => {
  const [state, setState] = useState({
    hour: 1,
  });

  // @ts-ignore
  return <Timing interval={'day'} value={state} onUpdate={setState} readonly={false}/>;
};

export const TimingHourDisabled : FC = () => {
  const [state, setState] = useState({
    hour: 1,
  });

  // @ts-ignore
  return <Timing interval={'hour'} value={state} onUpdate={setState} readonly/>;
};

// export const TimingMonth : FC = () => <Timing interval={'month'} />;
// export const TimingDay : FC = () => <Timing interval={'day'} />;
// export const TimingWeek : FC = () => <Timing interval={'week'} />;
