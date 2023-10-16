import { useContext } from 'react';
import { CONTEXT_DEFAULT_VALUE, LoaderContext } from '../context/loader_context';

export const useLoader = () => {
  const loaders = useContext(LoaderContext);
  if (!loaders) {
    return CONTEXT_DEFAULT_VALUE;
  }
  return loaders;
};
