import React from 'react';
import { ICommonNode } from '../folder_content';
import { INode } from '@apitable/core';

export interface ILoaderContext {
  nodeFilterLoader: {
    (nodes: ICommonNode[]): ICommonNode[];
    (nodes: INode[]): INode[];
  };
}

export const CONTEXT_DEFAULT_VALUE: ILoaderContext = {
  nodeFilterLoader: (node) => node,
};

export const LoaderContext = React.createContext<ILoaderContext>(CONTEXT_DEFAULT_VALUE);
