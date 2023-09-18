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

import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import RcTrigger from 'rc-trigger';
import { memo, useRef, useState } from 'react';
import { WrapperTooltip, useThemeColors, Switch } from '@apitable/components';
import { IViewProperty, t, Strings } from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import settingStyles from '../../field_setting/styles.module.less';
import styles from './styles.module.less';

interface IViewSelect {
  onChange: (viewId?: string) => void;
  views: IViewProperty[];
  foreignDatasheetReadable: boolean;
  viewId?: string;
}

export const ViewSelect = memo((props: IViewSelect) => {
  const colors = useThemeColors();
  const { onChange, viewId, foreignDatasheetReadable } = props;
  const views = props.views;
  const selectedView = views.find((view) => view.id === viewId);
  const view = selectedView ? selectedView : views[0];
  const [showViewPanel, setShowViewPanel] = useState(false);
  const viewSelectTriggerRef = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    setShowViewPanel(false);
  }, viewSelectTriggerRef);

  const handleTriggerClick = () => {
    setShowViewPanel(!showViewPanel);
  };

  const onSelectItemClick = (id: string) => {
    setShowViewPanel(false);
    onChange(id);
  };

  const PopContent = (
    <div className={styles.viewSelectPanel}>
      <div className={styles.viewSelect}>
        {views.map((view) => {
          // There is no view access to the link datasheet, only the assigned view can be seen in the view list, other views are not visible
          if (!foreignDatasheetReadable && viewId !== view.id) {
            return null;
          }
          return (
            <div
              key={view.id}
              className={classNames(styles.viewSelectItem, {
                [styles.viewSelectItemHighlight]: viewId === view.id,
              })}
              onClick={() => onSelectItemClick(view.id)}
            >
              <ViewIcon size={16} viewType={view.type} />
              {view.name}
            </div>
          );
        })}
      </div>
    </div>
  );

  const Trigger = (
    <div className={settingStyles.sectionInfo} onClick={handleTriggerClick} ref={viewSelectTriggerRef}>
      <div className={settingStyles.icon}>
        <ViewIcon size={16} viewType={view.type} />
      </div>
      <div className={settingStyles.text}>{view.name}</div>
      <div className={settingStyles.arrow}>
        <IconArrow width={10} height={10} fill={colors.thirdLevelText} />
      </div>
    </div>
  );

  const optionData = views.map((view) => {
    return {
      value: view.id,
      label: view.name,
      prefixIcon: <ViewIcon size={16} viewType={view.type} />,
    };
  });

  return (
    <section className={settingStyles.section}>
      <div className={classNames(settingStyles.sectionTitle, settingStyles.sub, styles.selectView)}>
        {t(Strings.link_to_specific_view)}
        <WrapperTooltip wrapper={!foreignDatasheetReadable} tip={t(Strings.no_permission_select_view)}>
          <span className={styles.tooltipContainer}>
            <Switch
              size="small"
              checked={Boolean(selectedView)}
              onChange={(checked) => (checked ? onChange(view.id) : onChange(undefined))}
              disabled={!foreignDatasheetReadable}
            />
          </span>
        </WrapperTooltip>
      </div>
      {selectedView && (
        <>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <RcTrigger
              action={'click'}
              popup={PopContent}
              destroyPopupOnHide
              popupAlign={{
                points: ['tl', 'tr'],
                offset: [30, 0],
                overflow: { adjustX: true },
              }}
              popupStyle={{ width: 280, background: colors.defaultBg }}
              popupVisible={showViewPanel}
              zIndex={10000}
            >
              {Trigger}
            </RcTrigger>
          </ComponentDisplay>

          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <MobileSelect onChange={onSelectItemClick} optionData={optionData} defaultValue={view.id} triggerComponent={Trigger} />
          </ComponentDisplay>
        </>
      )}
    </section>
  );
});
