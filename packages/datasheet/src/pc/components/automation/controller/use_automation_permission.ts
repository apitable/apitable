import { useAtomValue } from 'jotai';
import { INodePermissions, INodesMapItem, IReduxState } from '@apitable/core';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ScreenSize } from '../../common/component_display';
import { automationStateAtom } from './atoms';

export const useAutomationResourceNode = (): INodesMapItem=> {

  const stateValue = useAtomValue(automationStateAtom);

  return useAppSelector((state: IReduxState) => {
    return state.catalogTree.treeNodesMap[stateValue?.resourceId!] || state.catalogTree.privateTreeNodesMap[stateValue?.resourceId!];
  });
};

export const useAutomationResourcePermission = (): INodePermissions => {
  const stateValue = useAtomValue(automationStateAtom);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);
  const mirrorCreatable = useAppSelector((state: IReduxState) => {
    const resourceId = stateValue?.resourceId!;
    const defaultValue= state.catalogTree.treeNodesMap[resourceId]?.permissions ||
      state.catalogTree.privateTreeNodesMap[resourceId]?.permissions || {
      manageable: false,
      editable: false,
      readable: true,
      descriptionEditable: false,
    };
    if (isMobile) {
      return {
        ...defaultValue,
        manageable: false,
        editable: false,
        readable: true,
        descriptionEditable: false,
      };
    }
    return defaultValue;
  });

  return mirrorCreatable as INodePermissions;
};
