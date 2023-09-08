/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { Strings, t } from '@apitable/core';
import { SearchOutlined } from '@apitable/icons';
import { FieldSearchPanel, IFieldSearchPanelProps, ShowType } from './search_field_panel';

type ILinkFieldPanel = Pick<IFieldSearchPanelProps, 'onChange' | 'fields' | 'activeFieldId' | 'setSearchPanelVisible'>;

export const LinkFieldPanel: React.FC<React.PropsWithChildren<ILinkFieldPanel>> = (props) => {
  const { fields } = props;
  return (
    <FieldSearchPanel {...props} showType={ShowType.LinkField} errTip={fields.length ? '' : t(Strings.table_link_err)} prefix={<SearchOutlined />} />
  );
};
