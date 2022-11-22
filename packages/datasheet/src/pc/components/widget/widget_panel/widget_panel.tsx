import { Button, IconButton, Skeleton } from '@apitable/components';
import { Events, integrateCdnHost, IWidgetPanelStatus, Player, ResourceType, Selectors, Strings, t } from '@apitable/core';
import { CloseLargeOutlined } from '@apitable/icons';
import { useMount } from 'ahooks';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import Image from 'next/image';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { getEnvVariables } from 'pc/utils/env';
import { shallowEqual, useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import { useManageWidgetMap } from '../hooks';
import { expandWidgetCenter, InstallPosition } from '../widget_center/widget_center';
import styles from './style.module.less';
import { WidgetList } from './widget_list';
import { WidgetPanelHeader } from './widget_panel_header';

const EmptyPanel = ({ onClosePanel }: { onClosePanel?: () => void }) => {
  const linkId = useSelector(Selectors.getLinkId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const addNewPanel = () => {
    expandWidgetCenter(InstallPosition.WidgetPanel);
  };
  useMount(() => {
    Player.doTrigger(Events.datasheet_wigdet_empty_panel_shown);
  });
  return (
    <div className={styles.emptyPanel}>
      {onClosePanel && <IconButton onClick={onClosePanel} className={styles.closeIcon} icon={CloseLargeOutlined} />}
      <span className={styles.ikon}>
        <Image src={integrateCdnHost(getEnvVariables().WIDGET_PANEL_EMPTY_IMG!)} alt="" width={240} height={180} />
      </span>

      <p className={styles.desc}>{t(isMobile ? Strings.is_empty_widget_panel_mobile : Strings.is_empty_widget_panel_pc)}</p>
      {!isMobile && (
        <Button
          size={'middle'}
          color={'primary'}
          className={styles.buttonWrapper}
          prefixIcon={<IconAdd width={16} height={16} fill={'white'} />}
          onClick={addNewPanel}
          disabled={Boolean(linkId)}
        >
          {t(Strings.add_widget)}
        </Button>
      )}
      <p className={styles.docTip}>
        <a href={t(Strings.intro_widget)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
          {t(Strings.intro_widget_tips)}
        </a>
      </p>
    </div>
  );
};

export const WidgetPanel = () => {
  const { datasheetId, mirrorId } = useSelector(state => state.pageParams);
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
  const resourceId = mirrorId || datasheetId || '';
  const activeWidgetPanel = useSelector(state => {
    return Selectors.getResourceActiveWidgetPanel(state, resourceId, resourceType);
  });
  const netWorking = useSelector(state => Selectors.getResourceNetworking(state, datasheetId!, ResourceType.Datasheet), shallowEqual);
  const isEmptyPanel = !activeWidgetPanel;
  const isEmptyWidget = !(activeWidgetPanel && activeWidgetPanel.widgets.length);
  const { opening: isPanelOpening } = useSelector(state => {
    return Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || ({} as IWidgetPanelStatus);
  });
  const onClosePanel = () => {
    ShortcutActionManager.trigger(ShortcutActionName.ToggleWidgetPanel);
  };

  useManageWidgetMap();

  if (!isPanelOpening) {
    return null;
  }

  if (netWorking?.loading) {
    return (
      <div className={styles.skeletonWrapper}>
        <div className={styles.skeletonHeader}>
          <Skeleton width="40px" height="40px" circle />
          <Skeleton height="22px" />
        </div>
        <Skeleton count={2} height="40px" className={styles.skeletonInput} />
      </div>
    );
  }

  return (
    <div className={styles.widgetPanelContainer}>
      {isEmptyPanel ? (
        <EmptyPanel onClosePanel={onClosePanel} />
      ) : (
        <div className={styles.widgetPanel}>
          <WidgetPanelHeader onClosePanel={onClosePanel} />
          {isEmptyWidget ? <EmptyPanel /> : <WidgetList />}
        </div>
      )}
    </div>
  );
};
