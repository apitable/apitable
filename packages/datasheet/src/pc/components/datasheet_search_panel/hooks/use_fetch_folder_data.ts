import { useEffect } from 'react';
import { ISearchPanelState } from '../store/interface/search_panel';
import { useFetchChildren } from './use_fetch_children';
import { useFetchParent } from './use_fetch_parents';

interface IParams {
  localState: ISearchPanelState;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
}

export const useFetchFolderData = ({ localState, localDispatch }: IParams) => {
  const { data: parentData, isValidating: isParentVlidating } = useFetchParent({ folderId: localState.currentFolderId });
  const { data: childrenData, isValidating: isChildrenValidating } = useFetchChildren({ folderId: localState.currentFolderId });

  useEffect(() => {
    localDispatch({ parents: parentData });
  }, [parentData, localDispatch]);

  useEffect(() => {
    const nodes = childrenData || [];
    localDispatch({ nodes, showSearch: false });
  }, [childrenData, localDispatch]);

  return {
    isValidating: isParentVlidating || isChildrenValidating,
  };
};
