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

import { useState } from 'react';
import { ConfigConstant } from '@apitable/core';
import { SecondConfirmType } from '../components/datasheet_search_panel/interface';
import { useCatalog } from './use_catalog';

export interface IPanelInfo {
  folderId: string;
  datasheetId?: string;
  secondConfirmType?: SecondConfirmType;
}

export const useSearchPanel = () => {
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelInfo, setPanelInfo] = useState<IPanelInfo | null>(null);
  const { addTreeNode } = useCatalog();
  const onChange = ({
    datasheetId,
    viewId,
    viewName,
    secondConfirmType,
  }: {
    datasheetId?: string;
    viewId?: string;
    viewName?: string;
    secondConfirmType?: SecondConfirmType;
  }) => {
    setPanelVisible(false);

    const _secondConfirmType = panelInfo?.secondConfirmType || secondConfirmType;

    if (_secondConfirmType === SecondConfirmType.Form) {
      addTreeNode(
        panelInfo?.folderId,
        ConfigConstant.NodeType.FORM,
        {
          datasheetId,
          viewId,
        },
        viewName,
      );
    }
  };

  return {
    panelVisible,
    panelInfo,
    onChange,
    setPanelInfo,
    setPanelVisible,
  };
};
