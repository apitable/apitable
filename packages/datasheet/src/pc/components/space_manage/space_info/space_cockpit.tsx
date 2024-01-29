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

import { useMount } from 'ahooks';
import { FC } from 'react';
import { Events, IReduxState, Player } from '@apitable/core';
import { Loading } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { RecoverSpace } from './components/recover_space/recover_space';
import { SpaceInfo } from './space_info';

const SpaceCockpit: FC<React.PropsWithChildren<unknown>> = () => {
  const spaceInfo = useAppSelector((state: IReduxState) => state.space.curSpaceInfo);

  useMount(() => {
    Player.doTrigger(Events.space_setting_overview_shown);
  });

  if (!spaceInfo) {
    return <Loading />;
  }

  return spaceInfo.delTime ? <RecoverSpace /> : <SpaceInfo />;
};

export default SpaceCockpit;
