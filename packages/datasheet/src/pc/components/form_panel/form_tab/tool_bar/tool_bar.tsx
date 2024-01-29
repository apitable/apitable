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

import classNames from 'classnames';
import Trigger from 'rc-trigger';
import { useState } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Selectors, t, Strings, IFormProps, CollaCommandName, DATASHEET_ID } from '@apitable/core';
import { SettingOutlined, ShareOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { ToolItem } from '../../../tool_bar/tool_item';
import { SettingPanel } from './setting_panel';
import { ShareModal } from './share_modal';
import styles from './style.module.less';

interface IToolBarProps {
  nodeShared: boolean;
  showLabel?: boolean;
}

export const ToolBar: React.FC<React.PropsWithChildren<IToolBarProps>> = (props) => {
  const { nodeShared, showLabel = true } = props;
  const colors = useThemeColors();
  const [isPanelShow, setPanelShow] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { formId, formProps, manageable } = useAppSelector((state) => {
    const { id, snapshot, permissions } = Selectors.getForm(state)!;
    const { manageable } = permissions;
    return {
      formProps: snapshot.formProps,
      formId: id,
      manageable,
    };
  }, shallowEqual);

  const updateProps = (partProps: Partial<IFormProps>) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UpdateFormProps,
      formId,
      partialProps: partProps,
    });
    if (partProps.coverVisible != null || partProps.logoVisible != null) {
      // Remind the user that a setting is in effect when they scroll to the bottom of the page to change it
      const formContainer = document.querySelector('.vikaFormContainer');
      formContainer?.scrollTo(0, 0);
    }
  };
  const { embedId } = useAppSelector((state) => state.pageParams);

  const embedInfo = useAppSelector((state) => state.embedInfo);

  const showSetting = embedId ? embedInfo.viewControl?.toolBar?.formSettingBtn : true;

  const showShareBtn = embedId ? embedInfo.viewControl?.toolBar?.shareBtn : true;

  const commonProps = {
    formId,
    formProps,
    updateProps,
  };

  return (
    <>
      {!isMobile && manageable && showSetting && (
        <Trigger
          action={['click']}
          popup={<SettingPanel {...commonProps} />}
          destroyPopupOnHide
          popupAlign={{ points: ['tr', 'br'], offset: [-8, 10], overflow: { adjustX: true, adjustY: true } }}
          popupStyle={{ width: 240 }}
          popupVisible={isPanelShow}
          onPopupVisibleChange={(visible) => setPanelShow(visible)}
          zIndex={1000}
        >
          <ToolItem
            className={classNames(styles.toolbarItem, isPanelShow && styles.active)}
            text={t(Strings.form_tab_setting)}
            id={DATASHEET_ID.FORM_CONTAINER_SETTING}
            icon={<SettingOutlined size={16} color={isPanelShow ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
            onClick={() => setPanelShow(true)}
            showLabel={showLabel}
          />
        </Trigger>
      )}
      {showShareBtn && (
        <ToolItem
          icon={<ShareOutlined size={16} color={nodeShared ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
          text={t(Strings.form_tab_share)}
          isActive={nodeShared}
          className={styles.toolbarItem}
          onClick={() => setVisible(true)}
          showLabel={showLabel}
        />
      )}
      {<ShareModal formId={formId} visible={visible} onClose={() => setVisible(false)} />}
    </>
  );
};
