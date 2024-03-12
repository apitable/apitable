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

import { useMount } from 'ahooks';
import Image from 'next/image';
import { shallowEqual } from 'react-redux';
import { Button, IconButton, Skeleton, ThemeName } from '@apitable/components';
import { Events, IWidgetPanelStatus, Player, ResourceType, Selectors, Strings, t, PermissionType } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { ScreenSize } from 'pc/components/common/component_display';
import { InstallPosition } from 'pc/components/widget/widget_center/enum';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import WidgetEmptyDark from 'static/icon/datasheet/widget_empty_dark.png';
import WidgetEmptyLight from 'static/icon/datasheet/widget_empty_light.png';
import { useManageWidgetMap } from '../hooks';
import { expandWidgetCenter } from '../widget_center/widget_center';
import { WidgetList } from './widget_list';
import { WidgetPanelHeader } from './widget_panel_header';
import styles from './style.module.less';

const EmptyPanel = ({ onClosePanel }: { onClosePanel?: () => void | Promise<void> }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const addNewPanel = () => {
    expandWidgetCenter(InstallPosition.WidgetPanel);
  };
  useMount(() => {
    Player.doTrigger(Events.datasheet_wigdet_empty_panel_shown);
  });
  const themeName = useAppSelector((state) => state.theme);
  const widgetEmpty = themeName === ThemeName.Light ? WidgetEmptyLight : WidgetEmptyDark;
  const { embedId, shareId, templateId } = useAppSelector((state) => state.pageParams);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const embedHidden = embedId && embedInfo && embedInfo.permissionType !== PermissionType.PRIVATEEDIT;
  const hiddenAddButton = shareId || templateId || embedHidden;

  return (
    <div className={styles.emptyPanel}>
      {onClosePanel && <IconButton onClick={onClosePanel} className={styles.closeIcon} icon={CloseOutlined} />}
      <span className={styles.ikon}>
        <Image src={widgetEmpty} alt="" width={240} height={180} />
      </span>

      <p className={styles.desc}>{t(isMobile ? Strings.is_empty_widget_panel_mobile : Strings.is_empty_widget_panel_pc)}</p>
      {!isMobile && (
        <Button
          size={'middle'}
          color={'primary'}
          className={styles.buttonWrapper}
          prefixIcon={<AddOutlined size={16} color={'white'} />}
          onClick={addNewPanel}
          disabled={Boolean(hiddenAddButton)}
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
  const { datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
  const resourceId = mirrorId || datasheetId || '';
  const activeWidgetPanel = useAppSelector((state) => {
    return Selectors.getResourceActiveWidgetPanel(state, resourceId, resourceType);
  });
  const netWorking = useAppSelector((state) => Selectors.getResourceNetworking(state, datasheetId!, ResourceType.Datasheet), shallowEqual);
  const isEmptyPanel = !activeWidgetPanel;
  const isEmptyWidget = !(activeWidgetPanel && activeWidgetPanel.widgets.length);
  const { opening: isPanelOpening } = useAppSelector((state) => {
    return Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType) || ({} as IWidgetPanelStatus);
  });
  const onClosePanel = async () => {
    await ShortcutActionManager.trigger(ShortcutActionName.ToggleWidgetPanel);
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
