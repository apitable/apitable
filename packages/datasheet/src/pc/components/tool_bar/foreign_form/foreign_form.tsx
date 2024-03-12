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

import classnames from 'classnames';
import Trigger from 'rc-trigger';
import { FC, useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Strings, t, Selectors, DATASHEET_ID, StoreActions } from '@apitable/core';
import { FormOutlined } from '@apitable/icons';
import { TComponent } from 'pc/components/common/t_component';
import { useAppSelector } from 'pc/store/react-redux';
import { isEmbedPage } from '../../../../../utils/utils';
import { ToolItem } from '../tool_item';
import { FormListPanel, IFormNodeItem } from './form_list_panel';
import styles from './style.module.less';

interface IForeignFormProps {
  className: string;
  showLabel?: boolean;
  isHide?: boolean;
}

export const ForeignForm: FC<React.PropsWithChildren<IForeignFormProps>> = (props) => {
  const { className, showLabel = true, isHide } = props;
  const [loading, setLoading] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const [formList, setFormList] = useState<IFormNodeItem[]>([]);
  const colors = useThemeColors();
  const { folderId, datasheetId, viewId, nodePrivate, viewName } = useAppSelector((state) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const datasheet = Selectors.getDatasheet(state, datasheetId);
    const activeView = Selectors.getActiveViewId(state)!;
    const views = datasheet?.snapshot.meta.views || [];
    const viewName = views.find((item) => item.id === activeView)?.name;
    return {
      folderId: Selectors.getDatasheetParentId(state)!,
      datasheetId,
      viewId: activeView,
      nodePrivate: datasheet?.nodePrivate,
      viewName,
    };
  }, shallowEqual);
  const creatable = useAppSelector((state) => {
    const nodesMap = state.catalogTree[nodePrivate ? 'privateTreeNodesMap' : 'treeNodesMap'];
    const { manageable } = nodesMap[folderId]?.permissions || {};
    const { editable } = Selectors.getPermissions(state);
    return manageable && editable;
  });

  /**
   * The viewId is consistent when copying tables.
   * In this case, you need to combine datasheetId and viewId to identify the uniqueness.
   */
  const uniqueId = `${datasheetId}-${viewId}`;

  const fetchForeignFormList = async () => {
    if (isEmbedPage()) {
      return;
    }
    setLoading(true);
    const formList = await StoreActions.fetchForeignFormList(datasheetId, viewId);
    setFormList(formList || []);
    setLoading(false);
  };

  const onClick = () => {
    setPanelVisible(true);
    fetchForeignFormList();
  };

  useEffect(() => {
    fetchForeignFormList();
    // eslint-disable-next-line
  }, [uniqueId]);

  return (
    <>
      <Trigger
        action={['click']}
        popup={
          <FormListPanel
            spaceId={spaceId!}
            folderId={folderId}
            datasheetId={datasheetId}
            viewId={viewId}
            viewName={viewName}
            loading={loading}
            formList={formList}
            creatable={creatable}
          />
        }
        destroyPopupOnHide
        popupAlign={{ points: ['tr', 'br'], offset: [0, 0], overflow: { adjustX: true, adjustY: true } }}
        popupStyle={{ width: 400 }}
        popupVisible={panelVisible}
        onPopupVisibleChange={(visible) => setPanelVisible(visible)}
        zIndex={1000}
      >
        <ToolItem
          showLabel={isHide || showLabel}
          className={classnames(className, styles.foreignForm, {
            [styles.active]: panelVisible,
          })}
          text={formList.length ? <TComponent tkey={t(Strings.view_foreign_form_count)} params={{ count: formList.length }} /> : t(Strings.view_form)}
          icon={<FormOutlined size={16} color={panelVisible ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
          onClick={onClick}
          id={DATASHEET_ID.FORM_BTN}
        />
      </Trigger>
    </>
  );
};
