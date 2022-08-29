import { createContext } from 'react';
import { ResourceServiceEnhanced } from './service';

export const ResourceContext = createContext<ResourceServiceEnhanced | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ResourceContext.displayName = 'ResourceContext';
}
