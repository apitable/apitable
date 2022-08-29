import * as React from 'react';
import { FieldSearchPanel, IFieldSearchPanelProps, ShowType } from './search_field_panel';
import { ILinkField } from '@vikadata/core';

type ILookFieldPanelProps = Pick<IFieldSearchPanelProps, 'onChange' | 'fields' | 'field' | 'activeFieldId' | 'setSearchPanelVisible'> & {
  relatedLinkField: ILinkField
};

export const LookupFieldPanel: React.FC<ILookFieldPanelProps> = (props) => {
  return <FieldSearchPanel
    {...props}
    showType={ShowType.LookField}
  />;
};
