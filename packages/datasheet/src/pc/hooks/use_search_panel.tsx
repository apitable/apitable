import { useState } from 'react';
import { useCatalog } from './use_catalog';
import { ConfigConstant } from '@vikadata/core';

interface IPanelInfo {
  folderId: string;
  datasheetId?: string;
}

export const useSearchPanel = () => {
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelInfo, setPanelInfo] = useState<IPanelInfo | null>(null);
  const { addTreeNode } = useCatalog();
  const onChange = ({ datasheetId, viewId, viewName }) => {
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