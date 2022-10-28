import { memo, useRef } from 'react';
import styles from './styles.module.less';
import RcTrigger from 'rc-trigger';
import { IViewProperty, t, Strings } from '@apitable/core';
import classNames from 'classnames';
import settingStyles from '../../field_setting/styles.module.less';
import { Switch } from 'antd';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import { useState } from 'react';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileSelect } from 'pc/components/common';
import { WrapperTooltip, useThemeColors } from '@vikadata/components';
import { useClickAway } from 'ahooks';

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
  const selectedView = views.find(view => view.id === viewId);
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
        {views.map(view => {
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
              <ViewIcon width={16} height={16} viewType={view.type} />
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
        <ViewIcon width={16} height={16} viewType={view.type} />
      </div>
      <div className={settingStyles.text}>{view.name}</div>
      <div className={settingStyles.arrow}>
        <IconArrow width={10} height={10} fill={colors.thirdLevelText} />
      </div>
    </div>
  );

  const optionData = views.map(view => {
    return {
      value: view.id,
      label: view.name,
      prefixIcon: <ViewIcon width={16} height={16} viewType={view.type} />,
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
              onChange={checked => (checked ? onChange(view.id) : onChange(undefined))}
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
