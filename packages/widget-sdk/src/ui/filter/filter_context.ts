import { Store } from 'redux';
import { IReduxState } from '@apitable/core';
import React from 'react';

export interface IFilterContext {
  store: Store<IReduxState>
}

export const FilterContext = React.createContext<IFilterContext>(null!);
