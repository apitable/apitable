import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

// 目录树展开来源态
export enum SideBarType {
  User,
  UserWithoutPanel,
  Panel,
  None,
}

// 用户点击态
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
}

export const SideBarContext = createContext<ISideBarContextProps>({
  toggleType: SideBarType.None,
  clickType: SideBarClickType.None,
});

export const useSideBar = () => {
  const sideBarVisible = useSelector(state => state.space.sideBarVisible);
  const {
    toggleType,
    clickType,
    onSetClickType,
    onSetToggleType,
    onSetPanelVisible,
    onSetSideBarVisibleByOhter,
    onSetSideBarVisibleByUser,
  } = useContext(SideBarContext);

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