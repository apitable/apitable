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
import styles from './style.module.less';
import { t, Strings, RowHeightLevel, Selectors, ViewType, CollaCommandName, IGridViewProperty } from '@apitable/core';
import { IIconProps, RowhightExtremhighOutlined, RowhightHighOutlined, RowhightMediumOutlined, RowhightShortOutlined } from '@apitable/icons';
import { IUseListenTriggerInfo } from '@apitable/components';
import classNames from 'classnames';
import { colorVars, Checkbox, Divider, useListenVisualHeight } from '@apitable/components';
import { useSelector } from 'react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { resourceService } from 'pc/resource_service';

export function getRowHeightIcon(level: RowHeightLevel, props: IIconProps) {
  switch (level) {
    case RowHeightLevel.Short: {
      return <RowhightShortOutlined {...props} />;
    }
    case RowHeightLevel.Medium: {
      return <RowhightMediumOutlined {...props} />;
    }
    case RowHeightLevel.Tall: {
      return <RowhightHighOutlined {...props} />;
    }
    case RowHeightLevel.ExtraTall: {
      return <RowhightExtremhighOutlined {...props} />;
    }
    default: {
      return <RowhightShortOutlined {...props} />;
    }
  }
}

function short(isCurrent: boolean, changeCommand: (e: React.MouseEvent) => void) {
  return (
    <div
      className={classNames(styles.rowHeightItem, isCurrent ? styles.active : '')}
      onClick={changeCommand}
    >
      <div className={styles.icon}>
        {
          isCurrent ? getRowHeightIcon(RowHeightLevel.Short, { color: colorVars.primaryColor }) :
            getRowHeightIcon(RowHeightLevel.Short, { color: colorVars.thirdLevelText })
        }
      </div>
      {t(Strings.row_height_short)}
    </div>
  );
}

function medium(isCurrent: boolean, changeCommand: (e: React.MouseEvent) => void) {
  return (
    <div
      className={classNames(styles.rowHeightItem, isCurrent ? styles.active : '')}
      onClick={changeCommand}
    >
      <div className={styles.icon}>
        {
          isCurrent ? getRowHeightIcon(RowHeightLevel.Medium, { color: colorVars.primaryColor }) :
            getRowHeightIcon(RowHeightLevel.Medium, { color: colorVars.thirdLevelText })
        }
      </div>
      {t(Strings.row_height_medium)}
    </div>
  );
}

function tail(isCurrent: boolean, changeCommand: (e: React.MouseEvent) => void) {
  return (
    <div
      className={classNames(styles.rowHeightItem, isCurrent ? styles.active : '')}
      onClick={changeCommand}
    >
      <div className={styles.icon}>
        {
          isCurrent ? getRowHeightIcon(RowHeightLevel.Tall, { color: colorVars.primaryColor }) :
            getRowHeightIcon(RowHeightLevel.Tall, { color: colorVars.thirdLevelText })
        }
      </div>
      {t(Strings.row_height_tall)}
    </div>
  );
}

function extraTall(isCurrent: boolean, changeCommand: (e: React.MouseEvent) => void) {
  return (
    <div
      className={classNames(styles.rowHeightItem, isCurrent ? styles.active : '')}
      onClick={changeCommand}
    >
      <div className={styles.icon}>
        {
          isCurrent ? getRowHeightIcon(RowHeightLevel.ExtraTall, { color: colorVars.primaryColor }) :
            getRowHeightIcon(RowHeightLevel.ExtraTall, { color: colorVars.thirdLevelText })
        }
      </div>
      {t(Strings.row_height_extra_tall)}
    </div>
  );
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 340;

interface IChangeRowHeight {
  triggerInfo: IUseListenTriggerInfo | undefined
}

export const ChangeRowHeight = (props: IChangeRowHeight) => {
  const { triggerInfo } = props;
  const view = useSelector(state => Selectors.getCurrentView(state))!;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { style } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const rowLevelList = Object.keys(RowHeightLevel).filter(x => {
    // Gantt chart has only three heights.
    if (view.type === ViewType.Gantt && x === 'ExtraTall') {
      return false;
    }
    return isNaN(parseInt(x));
  });
  const currentRowHeightLevel = (
    view &&
    (view.type === ViewType.Grid || view.type === ViewType.Gantt) &&
    view.rowHeightLevel
  ) ? view.rowHeightLevel : 1;
  const autoHeadHeight = (view as IGridViewProperty).autoHeadHeight;

  function changeCommand(level: RowHeightLevel) {
    executeCommandWithMirror(()=>{
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRowHeight,
        viewId: view.id,
        level,
      });
    },{
      rowHeightLevel: level,
    });
  }

  const changeAutoHeadHeightCommand = (value: boolean) => {
    executeCommandWithMirror(()=>{
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetAutoHeadHeight,
        viewId: view.id,
        isAuto: value,
      });
    },{
      autoHeadHeight: value,
    });
  };

  function rowHeightLevelItem(level: RowHeightLevel) {
    switch (level) {
      case RowHeightLevel.Short:
        return short(currentRowHeightLevel === RowHeightLevel.Short, changeCommand.bind(null, RowHeightLevel.Short));
      case RowHeightLevel.Medium:
        return medium(currentRowHeightLevel === RowHeightLevel.Medium, changeCommand.bind(null, RowHeightLevel.Medium));
      case RowHeightLevel.Tall:
        return tail(currentRowHeightLevel === RowHeightLevel.Tall, changeCommand.bind(null, RowHeightLevel.Tall));
      case RowHeightLevel.ExtraTall:
      default: {
        return extraTall(
          currentRowHeightLevel === RowHeightLevel.ExtraTall,
          changeCommand.bind(null, RowHeightLevel.ExtraTall),
        );
      }
    }
  }

  return (
    <div className={styles.container} style={style} ref={containerRef}>
      <div className={styles.section}>
        <div className={styles.title}>
          {t(Strings.field_name_setting)}
        </div>
        <div className={styles.autoHeight}>
          <Checkbox 
            checked={Boolean(autoHeadHeight)} 
            onChange={changeAutoHeadHeightCommand} 
            size={12}
          >
            {t(Strings.wrap_text)}
          </Checkbox>
        </div>
      </div>
      <Divider
        style={{
          margin: '8px 0 8px 8px',
          width: 188,
        }}
      />
      <div className={styles.section}>
        <div className={styles.title}>
          {t(Strings.row_height_setting)}
        </div>
        {
          rowLevelList.map((item, index) => {
            return (
              <div key={index}>
                {rowHeightLevelItem(RowHeightLevel[item])}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};
