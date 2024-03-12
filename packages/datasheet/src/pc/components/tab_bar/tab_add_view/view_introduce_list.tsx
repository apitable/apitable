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
import Image from 'next/image';
import Trigger from 'rc-trigger';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Alert, Typography, useListenVisualHeight, useThemeColors, IUseListenTriggerInfo } from '@apitable/components';
import {
  ConfigConstant,
  DATASHEET_ID,
  FormView,
  getMaxViewCountPerSheet,
  getViewAnalyticsId,
  getViewClass,
  Selectors,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { useAppSelector } from 'pc/store/react-redux';
import DefaultViewPng from 'static/icon/datasheet/view/datasheet_img_view@4x.png';
import { NodeIcon } from './node_icon';
import styles from './style.module.less';

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 459;

interface IViewIntroduceList {
  addNewView: (e: React.MouseEvent, viewType: ViewType) => void;
  addNewNode: (e: React.MouseEvent, nodeType: ConfigConstant.NodeType) => void;
  triggerInfo?: IUseListenTriggerInfo;
}

const ViewIntroduce: React.FC<React.PropsWithChildren<{ viewType: ViewType }>> = (props) => {
  const { viewType: fieldType } = props;
  const info = getViewClass(fieldType).getViewIntroduce()!;
  if (!info) {
    return <></>;
  }
  return (
    <div className={styles.introduce}>
      <h3>{info?.title}</h3>
      <p>{info.desc}</p>
      {info.videoGuide ? (
        <video src={info.videoGuide} width={240} height={135} autoPlay loop />
      ) : (
        <Image src={DefaultViewPng} width={240} height={135} alt="" />
      )}
    </div>
  );
};

const NodeIntroduce: React.FC<React.PropsWithChildren<{ nodeType: ConfigConstant.NodeType }>> = () => {
  const info = FormView.getViewIntroduce();

  if (!info) {
    return <></>;
  }

  return (
    <div className={styles.introduce}>
      <h3>{info?.title}</h3>
      <p>{info.desc}</p>
      {info.videoGuide ? (
        <video src={info.videoGuide!} width={240} height={135} autoPlay loop />
      ) : (
        <Image src={DefaultViewPng} width={240} height={135} alt="" />
      )}
    </div>
  );
};

export const ViewIntroduceList = (props: IViewIntroduceList) => {
  const colors = useThemeColors();
  const { addNewView, addNewNode, triggerInfo } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewTypeList = [ViewType.Grid, ViewType.Gallery, ViewType.Kanban, ViewType.Gantt, ViewType.Calendar, ViewType.OrgChart];
  const embedId = useAppSelector((state) => state.pageParams.embedId);
  const formCreatable = useAppSelector((state) => {
    const folderId = Selectors.getDatasheetParentId(state)!;
    const { editable } = Selectors.getPermissions(state);
    const node = state.catalogTree.treeNodesMap[folderId] || state.catalogTree.privateTreeNodesMap[folderId];
    const { manageable } = node?.permissions || {};
    return manageable && editable;
  });
  const nodeTypeList = formCreatable ? [ConfigConstant.NodeType.FORM] : [];
  const isViewCountOverLimit = useAppSelector((state) => {
    return Selectors.getViewsList(state).length >= getMaxViewCountPerSheet();
  });
  const permissions = useAppSelector(state => Selectors.getPermissions(state));
  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
  });

  const TriggerComponent = (props: { children?: any; popupComponent?: any }) => {
    const { popupComponent } = props;
    return (
      <Trigger
        action={['hover']}
        popup={popupComponent}
        destroyPopupOnHide
        popupAlign={{ points: ['tl', 'tr'], offset: [18, 0], overflow: { adjustX: true, adjustY: true } }}
        popupStyle={{
          width: 288,
          position: 'absolute',
          zIndex: 200,
        }}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0}
      >
        {props.children}
      </Trigger>
    );
  };

  useEffect(() => {
    onListenResize();
  }, [isViewCountOverLimit, onListenResize]);

  return (
    <div ref={containerRef} style={style} className={styles.viewTypeContainer} id={DATASHEET_ID.SWITCH_VIEW_TYPE_CONTAINER}>
      <Typography style={{ marginBottom: isViewCountOverLimit ? 8 : 16, marginLeft: 8 }} variant={'body2'}>
        {t(Strings.new_view)}
      </Typography>
      {isViewCountOverLimit && (
        <Alert
          type={'error'}
          content={t(Strings.view_count_over_limit, { count: getMaxViewCountPerSheet() })}
          style={{ padding: 8, margin: 8, width: 'auto' }}
        />
      )}
      {viewTypeList.map((viewType, index) => {
        return (
          <TriggerComponent key={index} popupComponent={<ViewIntroduce viewType={viewType} />}>
            <section
              className={classNames(styles.viewItem, {
                [styles.disabled]: isViewCountOverLimit,
              })}
              onClick={(e) => {
                if (isViewCountOverLimit) {
                  return;
                }
                addNewView(e as any as React.MouseEvent, viewType);
              }}
              id={getViewAnalyticsId(viewType)}
              data-test-id={getViewAnalyticsId(viewType)}
            >
              <ViewIcon viewType={viewType} color={colors.primaryColor} size={16} />
              <span>{getViewClass(viewType).getViewIntroduce()!.title}</span>
              <AddOutlined color={colors.thirdLevelText} />
            </section>
          </TriggerComponent>
        );
      })}

      {nodeTypeList.length > 0 && <div className={styles.nodeTypeContainer}>
        {nodeTypeList.map((nodeType, index) => {
          return (
            <TriggerComponent key={index} popupComponent={<NodeIntroduce nodeType={nodeType}/>}>
              <section
                className={styles.viewItem}
                id={DATASHEET_ID.VIEW_CREATOR_FORM}
                onClick={(e) => addNewNode(e as any as React.MouseEvent, nodeType)}
              >
                <NodeIcon nodeType={nodeType} color={colors.primaryColor} size={16}/>
                <span>{FormView.getViewIntroduce()!.title}</span>
                <AddOutlined color={colors.thirdLevelText}/>
              </section>
            </TriggerComponent>
          );
        })}
      </div>}

      {!embedId && permissions.manageable && (
        <section
          className={styles.addNewDatasheet}
          onClick={() => ShortcutActionManager.trigger(ShortcutActionName.NewDatasheet)}
          id={DATASHEET_ID.VIEW_CREATOR_TABLE}
        >
          {t(Strings.tab_add_view_datasheet)}
        </section>
      )}
    </div>
  );
};
