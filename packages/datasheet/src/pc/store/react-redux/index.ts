import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { IReduxState } from '@apitable/core';
export const useAppSelector: TypedUseSelectorHook<IReduxState> = useSelector;
