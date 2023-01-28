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

import { Api, ConfigConstant, INode, IReduxState, Navigation, StoreActions, Strings, t, TEMPLATE_CENTER_ID } from '@apitable/core';
import { Checkbox, TreeSelect } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { BaseModal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useRootManageable, useTemplateRequest } from 'pc/hooks';
import { dispatch } from 'pc/worker/store';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PulldownIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import styles from './style.module.less';

export interface IUsingTemplateModalProps {
  onCancel: React.Dispatch<React.SetStateAction<string>>;
  templateId: string;
}

// HEAR!HEAR!HEAR!
interface ISelectTreeNode {
  pId: string;
  id: string;
  value: string;
  title: string;
  isLeaf: boolean;
}

export const UsingTemplateModal: FC<IUsingTemplateModalProps> = props => {
  const { onCancel, templateId } = props;
  const [treeData, setTreeData] = useState<ISelectTreeNode[]>([]);
  const [nodeId, setNodeId] = useState('');
  // Whether to use the data in the template
  const [isContainData, setIsContainData] = useState(true);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const { getNodeTreeReq } = useCatalogTreeRequest();
  const { usingTemplateReq } = useTemplateRequest();
  const { data: NodeTreeData } = useRequest(getNodeTreeReq);
  const { run: usingTemplate, loading } = useRequest(usingTemplateReq, { manual: true });

  useEffect(() => {
    if (NodeTreeData) {
      setTreeData(transformData([NodeTreeData]));
      setNodeId(NodeTreeData.nodeId);
    }
    // eslint-disable-next-line
  }, [NodeTreeData]);

  const transformData = (data: INode[]) => {
    if (!data) {
      return [];
    }
    const arr = data.reduce((prev, node) => {
      if (node.type === ConfigConstant.NodeType.DATASHEET || !node.permissions.childCreatable) {
        return prev;
      }
      const newNode = {
        id: node.nodeId,
        pId: node.parentId,
        value: node.nodeId,
        title: node.nodeName,
        isLeaf: !node.hasChildren,
      };
      let result: ISelectTreeNode[] = [];
      if (node.hasChildren && node.children) {
        result = transformData(node.children);
      }
      prev.push(newNode, ...result);
      return prev;
    }, [] as ISelectTreeNode[]);
    return arr;
  };

  const handleCancel = () => {
    onCancel('');
  };

  const onOk = async() => {
    if (!templateId) {
      return;
    }
    const result = await usingTemplate(templateId, nodeId, isContainData);
    if (result && spaceId) {
      dispatch(StoreActions.getSpaceInfo(spaceId!, true));
      Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: result.nodeId }});
    }
  };

  const onLoadData = treeNode => {
    const { id } = treeNode.props;
    if (treeData.findIndex(item => item.pId === id) !== -1) {
      return new Promise<void>(resolve => {
        resolve();
      });
    }
    return new Promise<void>(async resolve => {
      const { data: result } = await Api.getChildNodeList(id);
      const { data } = result;
      setTreeData([...treeData, ...transformData(data)]);
      resolve();
    });
  };

  const onChange = value => {
    setNodeId(value);
  };

  const checkboxChange = (e: CheckboxChangeEvent) => {
    setIsContainData(e.target.checked);
  };

  const { rootManageable } = useRootManageable();

  const disabled = !rootManageable && nodeId === NodeTreeData?.nodeId;

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
          {
            treeData.length !== 0 && nodeId &&
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              suffixIcon={<PulldownIcon />}
              value={nodeId}
              onChange={onChange}
              treeData={treeData}
              loadData={onLoadData}
              treeDefaultExpandedKeys={[NodeTreeData.nodeId]}
            />
          }
        </div>
        {disabled && <div className={styles.permissionTip}>{t(Strings.template_centre_using_template_permission_tip)}</div>}
        <Checkbox className={styles.checkbox} onChange={checkboxChange} defaultChecked={isContainData}>
          <span className={styles.checkboxText}>{t(Strings.template_centre_using_template_data)}</span>
        </Checkbox>
      </div>
    </BaseModal>
  );
};
