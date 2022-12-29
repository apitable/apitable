import * as React from 'react';
import { FieldSearchPanel, IFieldSearchPanelProps, ShowType } from './search_field_panel';
import { Strings, t } from '@apitable/core';
import SearchIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_search.svg';

type ILinkFieldPanel = Pick<IFieldSearchPanelProps, 'onChange' | 'fields' | 'activeFieldId' | 'setSearchPanelVisible'>;

export const LinkFieldPanel: React.FC<ILinkFieldPanel> = (props) => {
  const { fields } = props;
  return <FieldSearchPanel
    {...props}
    showType={ShowType.LinkField}
    errTip={fields.length ? '' : t(Strings.table_link_err)}
    prefix={<SearchIcon/>}
  />;
};
