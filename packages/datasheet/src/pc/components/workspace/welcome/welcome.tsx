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

import { FC } from 'react';
import { shallowEqual } from 'react-redux';
import { IReduxState } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileBar } from 'pc/components/mobile_bar';
import { CreateDatasheet } from 'pc/components/workspace/welcome/components/create_datasheet/create_datasheet';
import { Guide } from 'pc/components/workspace/welcome/components/guide/guide';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { ChatWelcome } from 'enterprise/chat_welcome/chat_welcome';

export const Welcome: FC<React.PropsWithChildren<unknown>> = () => {
  const { treeNodesMap, rootId } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      rootId: state.catalogTree.rootId,
      user: state.user.info,
    }),
    shallowEqual,
  );
  const spaceId = useAppSelector((state) => state.space.activeId);

  if (!treeNodesMap[rootId] || !spaceId) {
    return <></>;
  }

  const hasChildren = treeNodesMap[rootId].hasChildren;
  return (
    <>
      {
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileBar />
        </ComponentDisplay>
      }
      {hasChildren ? (getEnvVariables().IS_AITABLE ? <ChatWelcome /> : <Guide/>) : <CreateDatasheet />}
    </>
  );
};
