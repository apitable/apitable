import { ResourceServiceEnhanced } from './service';
import { onError } from 'pc/resource_service/error';

export * from './context';
export const resourceService: { instance: null | ResourceServiceEnhanced } = { instance: null };

export const initResourceService = (store) => {
  resourceService.instance = new ResourceServiceEnhanced(store, onError);
  (window as any).VkResourceService = resourceService.instance;
  return resourceService.instance;
};
