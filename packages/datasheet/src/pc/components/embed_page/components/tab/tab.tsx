import { Dispatch, SetStateAction } from 'react';
import { TextButton, useThemeColors } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { ListOutlined, SettingOutlined, ShareOutlined } from '@apitable/icons';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { useGetInfo } from '../../hooks/use_get_info';

interface ITabProps {
  setNodeId: Dispatch<SetStateAction<string>>;
  setOpenSetting: any;
  isMobile: boolean;
}

export const Tab: React.FC<ITabProps> = ({ setOpenSetting, isMobile, setNodeId }) => {
  const colors = useThemeColors();
  const { setSideBarVisible } = useSideBarVisible();
  const { embedPageId, shareId } = useAppSelector((state) => state.pageParams);
  const { nodeFavorite, permissions: nodePermissions, icon, nodeName, role } = useGetInfo();

  const isManager = role === ConfigConstant.Role.Manager;
  if (isMobile) {
    return (
      <div
        className={
          'vk-h-[40px] vk-py-2 vk-px-2 vk-bg-bgCommonDefault vk-border-0 vk-border-b-borderCommonDefault vk-border-b vk-border-solid vk-flex vk-justify-between'
        }
      >
        <div className={'vk-flex vk-items-center vk-bg-bgBrandDefault vk-rounded vk-p-1'} onClick={() => setSideBarVisible(true)}>
          <ListOutlined />
        </div>
        {isManager && !shareId && (
          <div>
            <TextButton prefixIcon={<SettingOutlined />} size="x-small" onClick={() => setOpenSetting(true)} className={'!vk-collapsevk-px-1'}>
              {t(Strings.form_tab_setting)}
            </TextButton>
            <TextButton prefixIcon={<ShareOutlined />} size="x-small" className={'!vk-px-1'} onClick={() => setNodeId(embedPageId!)}>
              {t(Strings.form_tab_share)}
            </TextButton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={'vk-w-full vk-px-4 vk-flex vk-justify-between'}
      style={{
        backgroundColor: colors.bgCommonDefault,
        borderBottom:'1px solid var(--borderCommonDefault)'
      }}
    >
      <div className={'vk-w-max'}>
        <NodeInfoBar
          data={{
            nodeId: embedPageId!,
            icon: icon,
            name: nodeName,
            type: ConfigConstant.NodeType.EMBED_PAGE,
            role: role,
            favoriteEnabled: nodeFavorite,
            nameEditable: nodePermissions?.renamable,
            iconEditable: !shareId && nodePermissions?.iconEditable,
            subscribeEnabled: true,
          }}
          hiddenModule={{
            favorite: Boolean(shareId),
          }}
        />
      </div>
      {isManager && !shareId && (
        <div className={'vk-flex vk-items-center'}>
          {/* <div className={'vk-w-[1px] vk-h-[20px] vk-mr-4'} style={{ backgroundColor: colors.borderCommonDefault }} /> */}
          <TextButton prefixIcon={<SettingOutlined />} size="small" onClick={() => setOpenSetting(true)}>
            {t(Strings.form_tab_setting)}
          </TextButton>
          <TextButton prefixIcon={<ShareOutlined />} size="small" onClick={() => setNodeId(embedPageId!)}>
            {t(Strings.form_tab_share)}
          </TextButton>
        </div>
      )}
    </div>
  );
};
