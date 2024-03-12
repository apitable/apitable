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

import { createContext, useContext } from 'react';

import { useAppSelector } from 'pc/store/react-redux';

export enum SideBarType {
  User,
  UserWithoutPanel,
  Panel,
  None,
}

export enum SideBarClickType {
  User,
  ToolBar,
  FindInput,
  None,
}

export interface ISideBarContextProps {
  toggleType: SideBarType;
  clickType: SideBarClickType;
  onSetToggleType?: (toggleType: SideBarType) => void;
  onSetClickType?: (clickType: SideBarClickType) => void;
  onSetPanelVisible?: (visible: boolean) => void;
  onSetSideBarVisibleByUser?: (visible: boolean, panelVisible?: boolean) => void;
  onSetSideBarVisibleByOhter?: (visible: boolean) => void;
  newTdbId?: string;
  setNewTdbId?: (newTdbId: string) => void;
}

export const SideBarContext = createContext<ISideBarContextProps>({
  toggleType: SideBarType.None,
  clickType: SideBarClickType.None,
});

export const useSideBar = () => {
  const sideBarVisible = useAppSelector((state) => state.space.sideBarVisible);
  const { toggleType, clickType, onSetClickType, onSetToggleType, onSetPanelVisible, onSetSideBarVisibleByOhter, onSetSideBarVisibleByUser } =
    useContext(SideBarContext);

  return {
    toggleType,
    clickType,
    sideBarVisible,
    onSetClickType,
    onSetToggleType,
    onSetPanelVisible,
    onSetSideBarVisibleByOhter,
    onSetSideBarVisibleByUser,
  };
};
