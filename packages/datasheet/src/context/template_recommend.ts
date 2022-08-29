import { ApiInterface } from '@vikadata/core';
import { createContext } from 'react';

interface ITemplateRecommendContext {
  recommendData: ApiInterface.ITemplateRecommendResponse;
}

export const TemplateRecommendContext = createContext<ITemplateRecommendContext>({ recommendData: {}} as ITemplateRecommendContext);
