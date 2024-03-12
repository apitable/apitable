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

import { IconButton } from '@apitable/components';
import { ResourceType, Selectors } from '@apitable/core';
import { WidgetOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { WidgetPanel } from 'pc/components/widget';
import { useMountWidgetPanelShortKeys } from 'pc/components/widget/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { Popup } from '../../common/mobile/popup';
import styles from './style.module.less';

export const WidgetTool = () => {
  const isOpenPanel = useAppSelector((state) => {
    const { mirrorId, datasheetId } = state.pageParams;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    return Boolean(Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType)?.opening);
  });

  const togglePanel = async () => {
    await ShortcutActionManager.trigger(ShortcutActionName.ToggleWidgetPanel);
  };

  useMountWidgetPanelShortKeys();

  return (
    <>
      <IconButton className={styles.widgetTool} icon={WidgetOutlined} onClick={togglePanel} />
      <Popup
        className={styles.widgetToolPopup}
        open={isOpenPanel}
        placement="right"
        width={'100vw'}
        height={'100vh'}
        closable={false}
        bodyStyle={{
          padding: '0',
        }}
      >
        <WidgetPanel />
      </Popup>
    </>
  );
};
