import { useAtomValue } from 'jotai';
import { useSelector } from 'react-redux';
import { INodePermissions, INodesMapItem, IReduxState } from '@apitable/core';
import { automationStateAtom } from './atoms';

export const useAutomationResourceNode = (): INodesMapItem=> {

  const stateValue = useAtomValue(automationStateAtom);

  return useSelector((state: IReduxState) => {
    return state.catalogTree.treeNodesMap[stateValue?.resourceId!];
  });
};

export const useAutomationResourcePermission = (): INodePermissions=> {

  const stateValue = useAtomValue(automationStateAtom);

  const mirrorCreatable = useSelector((state: IReduxState) => {
    return state.catalogTree.treeNodesMap[stateValue?.resourceId!]?.permissions || {
      manageable: false,
      editable: false,
      readable: true,
      descriptionEditable: false,
    };
  });

  return mirrorCreatable as INodePermissions;
};

