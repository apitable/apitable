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

import { useEffect } from 'react';
import * as React from 'react';
import IconMore from 'static/icon/common/common_icon_more_stand.svg';
import RedoIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_redo.svg';
import UndoIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_undo.svg';
import WorkingDirIcon from 'static/icon/workbench/catalogue/work.svg';
import styles from './style.module.less';
import { LinkButton, IconButton, useThemeColors } from '@apitable/components';
import { shallowEqual, useSelector } from 'react-redux';
import { resourceService } from 'pc/resource_service';
import { Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { expandNodeDescription, elementHasChild } from '../tab_bar/description_modal';
import { notify } from '../common/notify';
import { NotifyKey } from '../common/notify/notify.interface';
import { Popover } from '../common/mobile/popover';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { stopPropagation } from 'pc/utils';

export const MoreTool: React.FC = () => {
  const colors = useThemeColors();
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const shareId = useSelector(state => state.pageParams.shareId);
  const undoManager = resourceService.instance!.undoManager!;
  const datasheetName = useSelector(state => {
    const treeNodesMap = state.catalogTree.treeNodesMap;
    const datasheet = Selectors.getDatasheet(state);
    if (shareId) return datasheet ? datasheet.name : null;
    if (datasheetId && treeNodesMap[datasheetId]) {
      return treeNodesMap[datasheetId].nodeName;
    }
    if (datasheet && datasheet.name) {
      return datasheet.name;
    }
    return null;
  });

  const undo = e => {
    stopPropagation(e);
    if (undoLength) {
      undoManager.undo();
      notify.open({ message: t(Strings.shortcut_key_undo), key: NotifyKey.Undo });
    }
  };

  const redo = e => {
    stopPropagation(e);
    if (redoLength) {
      undoManager.redo();
      notify.open({ message: t(Strings.shortcut_key_redo), key: NotifyKey.Undo });
    }
  };

  const { undoLength, redoLength } = useSelector(() => {
    if (!undoManager) {
      return {
        undoLength: 0,
        redoLength: 0,
      };
    }
    return {
      undoLength: undoManager.getStockLength('undo'),
      redoLength: undoManager.getStockLength('redo'),
    };
  }, shallowEqual);

  const content = (
    <div className={styles.content}>
      <div
        className={styles.moreToolItem}
        onClick={undo}
      >
        <LinkButton
          underline={false}
          disabled={!undoLength}
          className={styles.moreToolBtn}
        >
          <UndoIcon width={16} height={16} fill={!undoLength ? colors.secondLevelText : colors.black[50]} />
          <span className={classNames({ [styles.toolName]: undoLength })}>{t(Strings.undo)}</span>
        </LinkButton>
      </div>
      <div
        className={styles.moreToolItem}
        onClick={redo}
      >
        <LinkButton
          underline={false}
          disabled={!redoLength}
          className={styles.moreToolBtn}
        >
          <RedoIcon width={16} height={16} fill={!redoLength ? colors.secondLevelText : colors.black[50]} />
          <span className={classNames({ [styles.toolName]: redoLength })}>{t(Strings.redo)}</span>
        </LinkButton>
      </div>
      <div
        className={styles.moreToolItem}
        onClick={() => {
          expandNodeDescription({
            activeNodeId: datasheetId,
            datasheetName,
            isMobile: true,
          });
        }}
      >
        <LinkButton 
          underline={false}
          className={styles.moreToolBtn}
        >
          <WorkingDirIcon width={16} height={16} fill={colors.black[50]} />
          <span className={styles.toolName}>{t(Strings.file_summary)}</span>
        </LinkButton>
      </div>
    </div>
  );

  const desc = useSelector(state => Selectors.getNodeDesc(state), shallowEqual);

  useEffect(() => {
    const storage = getStorage(StorageName.Description) || [];
    if (!storage || !storage.includes(datasheetId)) {
      setStorage(StorageName.Description, [datasheetId]);
      if (desc && elementHasChild(desc.render || '')) {
        expandNodeDescription({
          activeNodeId: datasheetId,
          datasheetName,
          isMobile: true,
        });
      }
    }
  // eslint-disable-next-line
  }, [datasheetId]);

  return (
    <Popover content={content}>
      <IconButton
        icon={() => <IconMore width={16} height={16} fill={colors.secondLevelText} />}
        className={styles.trigger}
      />
    </Popover>
  );
};
