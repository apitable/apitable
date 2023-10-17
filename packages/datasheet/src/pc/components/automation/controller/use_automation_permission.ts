import { useAtomValue } from 'jotai';
import { useSelector } from 'react-redux';
import { INodePermissions, INodesMapItem, IReduxState } from '@apitable/core';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { automationStateAtom } from './atoms';

export const useAutomationResourceNode = (): INodesMapItem=> {

  const stateValue = useAtomValue(automationStateAtom);

  return useSelector((state: IReduxState) => {
    return state.catalogTree.treeNodesMap[stateValue?.resourceId!];
  });
};

export const useAutomationResourcePermission = (): INodePermissions=> {

  const stateValue = useAtomValue(automationStateAtom);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);
  const mirrorCreatable = useSelector((state: IReduxState) => {
    if(isMobile) {
      return {
        manageable: false,
        editable: false,
        readable: true,
        descriptionEditable: false,
      };
    }
    return state.catalogTree.treeNodesMap[stateValue?.resourceId!]?.permissions || {
      manageable: false,
      editable: false,
      readable: true,
      descriptionEditable: false,
    };
  });

  return mirrorCreatable as INodePermissions;
};
