import { ResourceContext } from 'pc/resource_service';
import { useContext } from 'react';

export const useUploadManager = () => {
  const resourceContext = useContext(ResourceContext)!;
  return resourceContext.uploadManager;
};
