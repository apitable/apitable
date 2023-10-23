import React from 'react';
import { INode } from '@apitable/core';

interface ILoaderFunc {
  // (nodes: ICommonNode[]): ICommonNode[];

  (nodes: INode[]): INode[];
}

export interface ILoaderContext {
  nodeTypeFilterLoader: ILoaderFunc;
  nodeVisibleFilterLoader: ILoaderFunc;
  nodeStatusLoader: (node: INode) =>
    | undefined
    | {
        budget: string;
        message: string;
      };
}

export const CONTEXT_DEFAULT_VALUE: ILoaderContext = {
  nodeTypeFilterLoader: (node) => node,
  nodeVisibleFilterLoader: (node) => node,
  nodeStatusLoader: (node) => undefined,
};

export const LoaderContext = React.createContext<ILoaderContext>(CONTEXT_DEFAULT_VALUE);
