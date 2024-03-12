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
import { IMirror, ResourceType } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { DataSheetPane } from 'pc/components/datasheet_pane';
import { MirrorPath } from 'pc/components/mirror/mirror_path';
import { MobileToolBar } from 'pc/components/mobile_tool_bar';
import { NetworkStatus } from 'pc/components/network_status';
import { SuspensionPanel } from 'pc/components/suspension_panel';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { View } from 'pc/components/view';
import { useNetwork } from 'pc/hooks/use_network';

import { useAppSelector } from 'pc/store/react-redux';
import { JobTaskProvider } from '../editors/button_editor/job_task';
import styles from './style.module.less';

export const Mirror: React.FC<React.PropsWithChildren<{ mirror: IMirror }>> = ({ mirror }) => {
  const { status } = useNetwork(true, mirror!.id, ResourceType.Mirror);
  const { shareId, datasheetId } = useAppSelector((state) => state.pageParams);

  return (
    <DataSheetPane
      panelLeft={
        <div className={styles.mirrorContainer} style={{ width: '100%', height: '100%' }}>
          <div className={styles.tab}>
            <SuspensionPanel shareId={shareId} datasheetId={datasheetId} />
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <div className={styles.left}>
                <MirrorPath nodeInfo={mirror} breadInfo={mirror!.sourceInfo} permission={mirror!.permissions} />
              </div>
              <div className={styles.right}>
                <CollaboratorStatus resourceId={mirror!.id} resourceType={ResourceType.Mirror} />
                <NetworkStatus currentStatus={status} />
              </div>
            </ComponentDisplay>
            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <MobileToolBar hideToolBar />
            </ComponentDisplay>
          </div>

          <JobTaskProvider>
            <View />
          </JobTaskProvider>
        </div>
      }
    />
  );
};
