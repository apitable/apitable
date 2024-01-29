import { useMount } from 'ahooks';
import classNames from 'classnames';
import { Events, IWidgetPackage, Player, Strings, t, WidgetReleaseType } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { useResourceManageable } from 'pc/components/widget/hooks';
import { IWidgetPackageItemBase } from 'pc/components/widget/widget_center/interface';
import styles from 'pc/components/widget/widget_center/style.module.less';
import { expandWidgetCreate } from 'pc/components/widget/widget_center/widget_create_modal';
import { WidgetPackageItem } from 'pc/components/widget/widget_center/widget_package_item';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';

import { useAppSelector } from 'pc/store/react-redux';

type IWidgetPackageListProps = IWidgetPackageItemBase & {
  needPlaceholder: boolean;
  data: IWidgetPackage[];
  releaseType?: WidgetReleaseType;
  refreshList?(): void;
};

export const WidgetPackageList = (props: IWidgetPackageListProps) => {
  const { installPosition, onModalClose, needPlaceholder, data, releaseType, showMenu } = props;
  const dashboardId = useAppSelector((state) => state.pageParams.dashboardId);
  const manageable = useResourceManageable();

  useMount(() => {
    Player.doTrigger(Events.datasheet_widget_center_modal_shown);
  });

  const createWidget = () => {
    expandWidgetCreate({ installPosition, closeModal: onModalClose });
  };

  const canCreateWidget = manageable && !dashboardId;

  return (
    <div className={styles.widgetPackageList}>
      {data.map((item) => (
        <WidgetPackageItem key={item.widgetPackageId} {...item} installPosition={installPosition} onModalClose={onModalClose} showMenu={showMenu} />
      ))}
      {/* Dashboard does not provide a widget creation portal. */}
      {releaseType === WidgetReleaseType.Space && (
        <WrapperTooltip
          wrapper={!canCreateWidget}
          tip={!manageable ? t(Strings.no_permission_create_widget) : t(Strings.tooltip_cannot_create_widget_from_dashboard)}
        >
          <div
            className={classNames(styles.widgetPackageItem, styles.createWidgetWrapper, !canCreateWidget && styles.disableCreateWidget)}
            onClick={() => canCreateWidget && createWidget()}
          >
            <AddOutlined size={16} />
            <span>{t(Strings.create_widget)}</span>
          </div>
        </WrapperTooltip>
      )}
      {needPlaceholder && <div className={styles.placeholder} />}
    </div>
  );
};
