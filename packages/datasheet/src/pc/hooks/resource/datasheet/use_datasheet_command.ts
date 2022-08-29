import { ResourceContext } from 'pc/resource_service';
import { useContext } from 'react';

export const useDatasheetCommand = () => {
  const resourceContext = useContext(ResourceContext)!;
  return resourceContext.commandManager;
};
