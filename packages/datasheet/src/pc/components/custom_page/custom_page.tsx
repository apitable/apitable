import { useEffect, useState } from 'react';
import { Button, ScreenSize, useResponsive } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { SettingOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import AutomationEmptyDark from 'static/icon/datasheet/automation_empty_dark.png';
import { Share } from '../catalog/share';
import { NoPermission } from '../no_permission';
import { Setting } from './components/setting/setting';
import { Tab } from './components/tab/tab';
import { useGetDesc } from './hooks/use_get_desc';
import { useGetInfo } from './hooks/use_get_info';
import { useGetNodesMap } from './hooks/use_get_tree_node_map';

export const CustomPage = () => {
  const { url, role } = useGetInfo();
  const [openSetting, setOpenSetting] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { shareId, customPageId, templateId } = useAppSelector((state) => state.pageParams);
  const nodesMap = useGetNodesMap(customPageId!);

  const node = nodesMap[customPageId!];

  useEffect(() => {
    if (!node) return;
    const _url = node?.extra ? JSON.parse(node?.extra).embedPage.url : '';

    setOpenSetting(!Boolean(_url));
  }, [node]);

  const canAddUrl = role !== ConfigConstant.Role.Reader;

  useGetDesc();

  if (!role && !shareId && !templateId) {
    return <NoPermission />;
  }

  return (
    <div className={'vk-w-full vk-h-screen vk-flex vk-flex-col'}>
      <Tab setOpenSetting={setOpenSetting} isMobile={isMobile} setNodeId={setNodeId} />
      <div className={'vk-flex-grow'}>
        {url ? (
          <iframe src={url} width={'100%'} height={'100%'} frameBorder="0" />
        ) : (
          <div className={'vk-flex vk-flex-col vk-justify-center vk-h-full vk-items-center vk-space-y-4 vk-bg-bgCommonDefault'}>
            <img src={AutomationEmptyDark.src} alt="" width={200} height={150} />
            {!shareId && canAddUrl && (
              <Button prefixIcon={<SettingOutlined />} className={'vk-block vk-w-max'} onClick={() => setOpenSetting(true)}>
                {t(Strings.embed_page_add_url)}
              </Button>
            )}
          </div>
        )}
      </div>
      <Setting open={openSetting} onClose={() => setOpenSetting(false)} />
      <Share nodeId={nodeId} onClose={() => setNodeId('')} />
    </div>
  );
};
