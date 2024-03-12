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

import { Tooltip } from 'antd';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { IconButton, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { RedoOutlined, UndoOutlined } from '@apitable/icons';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import styles from '../style.module.less';

export const Undo: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className }) => {
  const colors = useThemeColors();
  const undo = () => {
    if (undoLength) {
      resourceService.instance!.undoManager?.undo();
      notify.open({ message: t(Strings.shortcut_key_undo), key: NotifyKey.Undo });
    }
  };

  const redo = () => {
    if (redoLength) {
      resourceService.instance!.undoManager?.redo();
      notify.open({ message: t(Strings.shortcut_key_redo), key: NotifyKey.Undo });
    }
  };

  const { undoLength, redoLength } = useAppSelector(() => {
    return {
      undoLength: resourceService.instance!.undoManager?.getStockLength('undo'),
      redoLength: resourceService.instance!.undoManager?.getStockLength('redo'),
    };
  }, shallowEqual);
  const ReactUndoIcon = () => <UndoOutlined size={16} color={colors.secondLevelText} className={styles.toolIcon} />;
  const ReactRedoIcon = () => <RedoOutlined size={16} color={colors.secondLevelText} className={styles.toolIcon} />;
  return (
    <div className={className}>
      <Tooltip title={`${t(Strings.undo)} ${getShortcutKeyString(ShortcutActionName.Undo)}`}>
        <IconButton
          disabled={!undoLength}
          shape="square"
          onClick={undo}
          style={{ marginRight: 8, color: colors.secondLevelText }}
          data-test-id={'undo'}
          icon={ReactUndoIcon}
        />
      </Tooltip>
      <Tooltip title={`${t(Strings.redo)} ${getShortcutKeyString(ShortcutActionName.Redo)}`}>
        <IconButton
          shape="square"
          style={{ color: colors.secondLevelText }}
          disabled={!redoLength}
          onClick={redo}
          data-test-id={'redo'}
          icon={ReactRedoIcon}
        />
      </Tooltip>
    </div>
  );
};
