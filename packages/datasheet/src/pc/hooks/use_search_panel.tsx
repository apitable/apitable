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
import { useCatalog } from './use_catalog';
import { ConfigConstant } from '@apitable/core';

interface IPanelInfo {
  folderId: string;
  datasheetId?: string;
}

export const useSearchPanel = () => {
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelInfo, setPanelInfo] = useState<IPanelInfo | null>(null);
  const { addTreeNode } = useCatalog();
  const onChange = ({ datasheetId, viewId, viewName }: { datasheetId?: string, viewId?: string, viewName?: string }) => {
    setPanelVisible(false);
    addTreeNode(panelInfo?.folderId, ConfigConstant.NodeType.FORM, {
      datasheetId,
      viewId,
    }, viewName);
  };

  return {
    panelVisible,
    panelInfo,
    onChange,
    setPanelInfo,
    setPanelVisible,
  };
};