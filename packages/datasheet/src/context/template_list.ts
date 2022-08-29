import { ITemplate } from '@vikadata/core';
import { createContext } from 'react';

interface ITemplateListContext {
  templateListData: ITemplate[]
}

export const TemplateListContext = createContext<ITemplateListContext>({ templateListData: {}} as ITemplateListContext);
