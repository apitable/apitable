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

export const CustomPage = () => {
  const { url, role } = useGetInfo();
  const [openSetting, setOpenSetting] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { shareId, embedPageId } = useAppSelector((state) => state.pageParams);
  const treeNodesMap = useAppSelector((state) => state.catalogTree.treeNodesMap);

  const node = treeNodesMap[embedPageId!];

  useEffect(() => {
    if (!node) return;
    const _url = node?.extra ? JSON.parse(node?.extra).embedPage.url : '';

    setOpenSetting(!Boolean(_url));
  }, [node]);

  const isManager = role === ConfigConstant.Role.Manager;

  useGetDesc();

  if (!role && !shareId) {
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
            {!shareId && isManager && (
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
