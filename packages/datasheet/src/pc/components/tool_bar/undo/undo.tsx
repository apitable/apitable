import { Strings, t } from '@apitable/core';
import { Tooltip } from 'antd';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import RedoIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_redo.svg';
import UndoIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_undo.svg';
import styles from '../style.module.less';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { IconButton, useThemeColors } from '@vikadata/components';

export const Undo: React.FC<{ className?: string }> = ({ className }) => {
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

  const { undoLength, redoLength } = useSelector(() => {
    return {
      undoLength: resourceService.instance!.undoManager?.getStockLength('undo'),
      redoLength: resourceService.instance!.undoManager?.getStockLength('redo'),
    };
  }, shallowEqual);
  const ReactUndoIcon = () => <UndoIcon width={16} height={16} fill={colors.secondLevelText} className={styles.toolIcon} />;
  const ReactRedoIcon = () => <RedoIcon width={16} height={16} fill={colors.secondLevelText} className={styles.toolIcon} />;
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
