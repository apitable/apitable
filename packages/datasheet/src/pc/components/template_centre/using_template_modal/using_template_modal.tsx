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

import { Checkbox, TreeSelect } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { usePostHog } from 'posthog-js/react';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Api, IReduxState, Navigation, Strings, t, TEMPLATE_CENTER_ID, TrackEvents } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { BaseModal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useRootManageable, useTemplateRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { transformNodeTreeData, ISelectTreeNode } from 'pc/utils';
import styles from './style.module.less';

export interface IUsingTemplateModalProps {
  onCancel: React.Dispatch<React.SetStateAction<string>>;
  templateId: string;
}

export const UsingTemplateModal: FC<React.PropsWithChildren<IUsingTemplateModalProps>> = (props) => {
  const { onCancel, templateId } = props;
  const [treeData, setTreeData] = useState<ISelectTreeNode[]>([]);
  const [nodeId, setNodeId] = useState('');
  // Whether to use the data in the template
  const [isContainData, setIsContainData] = useState(true);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const userUnitId = useAppSelector((state) => state.user.info?.unitId);
  const { getNodeTreeReq, getPrivateTreeDataReq } = useCatalogTreeRequest();
  const { usingTemplateReq } = useTemplateRequest();
  const { data: nodeTreeData } = useRequest(getNodeTreeReq);
  const { data: nodePrivateTreeData } = useRequest(getPrivateTreeDataReq);
  const { run: usingTemplate, loading } = useRequest(usingTemplateReq, { manual: true });
  const posthog = usePostHog();

  useEffect(() => {
    if (nodeTreeData) {
      const teamPId = `${nodeTreeData.nodeId}-team`;
      const _nodeTree = transformNodeTreeData([nodeTreeData]).slice(1).map((item) => {
        if (item.pId === nodeTreeData.nodeId) {
          return {
            ...item,
            pId: teamPId,
          };
        }
        return item;
      });
      const privatePId = `${nodeTreeData.nodeId}-private`;
      const _privateNodeTree = transformNodeTreeData([nodePrivateTreeData]).slice(1).map((item) => {
        if (item.pId === nodePrivateTreeData.nodeId) {
          return {
            ...item,
            pId: privatePId,
          };
        }
        return item;
      });
      const treeData = [
        {
          title: t(Strings.catalog_team),
          value: teamPId,
          id: teamPId,
          pId: 'team',
          isLeaf: false,
        },
        ..._nodeTree,
        {
          title: t(Strings.catalog_private),
          value: privatePId,
          id: privatePId,
          pId: 'private',
          isLeaf: false,
          isPrivate: true,
        },
        ..._privateNodeTree,
      ];
      setTreeData(treeData);
      setNodeId(teamPId);
    }
  }, [nodeTreeData, nodePrivateTreeData]);

  const handleCancel = () => {
    onCancel('');
  };

  const checkNodePrivate = (nodeId: string) => {

    if (nodeId.includes('private')) {
      return true;
    }
    return transformNodeTreeData([nodePrivateTreeData]).slice(1).some((item) => item.id === nodeId);
  };

  const onOk = async () => {
    if (!templateId) {
      return;
    }
    posthog?.capture(TrackEvents.TemplateConfirmUse);
    const isPrivate = checkNodePrivate(nodeId);
    const _nodeId = nodeId.split('-')[0];
    const result = await usingTemplate(templateId, _nodeId, isContainData, isPrivate ? userUnitId : undefined);
    if (result && spaceId) {
      Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: result.nodeId } });
    }
  };

  const onLoadData = (treeNode: any) => {
    const { id } = treeNode.props;
    if (treeData.findIndex((item) => item.pId === id) !== -1) {
      return new Promise<void>((resolve) => {
        resolve();
      });
    }
    return new Promise<void>(async (resolve) => {
      const { data: result } = await Api.getChildNodeList(id);
      const { data } = result;
      setTreeData([...treeData, ...transformNodeTreeData(data)]);
      resolve();
    });
  };

  const onChange = (value: string) => {
    setNodeId(value);
  };

  const checkboxChange = (e: CheckboxChangeEvent) => {
    setIsContainData(e.target.checked);
  };

  const { rootManageable } = useRootManageable();

  const disabled = !rootManageable && nodeId === nodeTreeData?.nodeId;

  return (
    <BaseModal
      className={styles.baseModal}
      title={t(Strings.template_center_use_to_create_datasheets)}
      onCancel={handleCancel}
      onOk={onOk}
      okButtonProps={{ loading, id: TEMPLATE_CENTER_ID.CONFIRM_BTN_IN_TEMPLATE_MODAL, disabled }}
    >
      <div className={styles.usingTemplateWrapper}>
        <div className={styles.tip}>{t(Strings.template_centre_using_template_tip)}</div>
        <div className={styles.selectWrapper}>
          {treeData.length !== 0 && nodeId && (
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              suffixIcon={<ChevronDownOutlined />}
              value={nodeId}
              onChange={onChange}
              treeData={treeData}
              loadData={onLoadData}
              popupClassName="usingTemplate"
              treeDefaultExpandedKeys={[nodeTreeData.nodeId]}
            />
          )}
        </div>
        {disabled && <div className={styles.permissionTip}>{t(Strings.template_centre_using_template_permission_tip)}</div>}
        <Checkbox className={styles.checkbox} onChange={checkboxChange} defaultChecked={isContainData}>
          <span className={styles.checkboxText}>{t(Strings.template_centre_using_template_data)}</span>
        </Checkbox>
      </div>
    </BaseModal>
  );
};
