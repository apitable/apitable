import { ResourceContext } from 'pc/resource_service';
import { useContext } from 'react';

export const useClipboard = () => {
  const resourceContext = useContext(ResourceContext)!;
  return resourceContext.clipboard;
};
