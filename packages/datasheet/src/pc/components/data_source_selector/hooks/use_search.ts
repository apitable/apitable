import { debounce } from 'lodash';
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Api, ConfigConstant, INode } from '@apitable/core';
import { IViewNode } from 'pc/components/data_source_selector/folder_content';
import { useLoader } from 'pc/components/data_source_selector/hooks/use_loader';
import { ISearchPanelState } from '../store/interface/search_panel';

import {useAppSelector} from "pc/store/react-redux";

interface IParams {
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  localState: ISearchPanelState;
}

export const useSearch = ({ localDispatch, localState }: IParams) => {
  const spaceId = useAppSelector((state) => state.space.activeId!);
  const { nodeTypeFilterLoader } = useLoader();
  const requestNumberRef = useRef(0);

  const search = useMemo(() => {
    return debounce((spaceId: string, val: string, currentRequestNumber: number) => {
      Api.searchNode(spaceId, val.trim()).then((res) => {
        if (currentRequestNumber !== requestNumberRef.current) {
          return;
        }

        const { data, success } = res.data;

        if (success) {
          const nodes = nodeTypeFilterLoader(data);
          const { folders, files } = nodes.reduce<{
            folders: (INode | IViewNode)[];
            files: (INode | IViewNode)[];
              }>(
              (collect, node) => {
                if (node.type === ConfigConstant.NodeType.FOLDER) {
                  collect.folders.push(node);
                } else {
                  collect.files.push(node);
                }
                return collect;
              },
              { folders: [], files: [] },
              );

          localDispatch({ showSearch: true });
          if (!folders.length && !files.length) {
            localDispatch({ searchResult: val });
            return;
          }
          localDispatch({ searchResult: { folders, files } as any });
        }
      });
    }, 500);
  }, [localDispatch]);

  useEffect(() => {
    if (!localState.searchValue) {
      localDispatch({ showSearch: false });
      requestNumberRef.current++;
      return;
    }
    search(spaceId, localState.searchValue, ++requestNumberRef.current);
    // eslint-disable-next-line
  }, [spaceId, localState.searchValue]);
};
