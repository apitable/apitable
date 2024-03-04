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

import { useUpdateEffect } from 'ahooks';
import { Form, Input } from 'antd';
import * as React from 'react';
import { FC, useState } from 'react';
import { ConfigConstant, IReduxState, Navigation, Selectors, Strings, t } from '@apitable/core';
import { BaseModal, Message, Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useTemplateRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export interface IGenerateTemplateProps {
  nodeId?: string;
  onCancel: () => void;
}

export const GenerateTemplate: FC<React.PropsWithChildren<IGenerateTemplateProps>> = ({ nodeId, onCancel }) => {
  const catalogTreeActiveType = useAppSelector((state) => state.catalogTree.activeType);
  const nodeKey = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE ? 'privateTreeNodesMap' : 'treeNodesMap';
  const nodesMap = useAppSelector((state: IReduxState) => state.catalogTree[nodeKey]);
  const activeNodeId = useAppSelector((state: IReduxState) => Selectors.getNodeId(state));
  nodeId = nodeId || activeNodeId;
  const [name, setName] = useState(nodesMap[nodeId!].nodeName);
  const [errorMsg, setErrorMsg] = useState('');
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { createTemplateReq, templateNameValidateReq } = useTemplateRequest();
  const { run: createTemplate, data: createTemplateData, loading } = useRequest(createTemplateReq, { manual: true });
  const { run: templateNameValidate } = useRequest(templateNameValidateReq, { manual: true });

  useUpdateEffect(() => {
    if (!createTemplateData) {
      return;
    }
    if (createTemplateData.success) {
      Message.success({
        content: (
          <>
            {t(Strings.template_created_successfully)}
            <i
              onClick={() =>
                Router.push(Navigation.TEMPLATE, {
                  params: {
                    spaceId,
                    categoryId: 'tpcprivate',
                    templateId: createTemplateData.data,
                  },
                })
              }
            >
              {t(Strings.click_to_view)}
            </i>
          </>
        ),
      });
      onCancel();
    } else {
      if (createTemplateData.code === 430) {
        const modalConfig = {
          title: t(Strings.save_template_disabled),
          content: createTemplateData.message,
          onOk: () => {
            customModal.destroy();
          },
          okText: t(Strings.submit),
        };
        const customModal = Modal.warning(modalConfig);
      } else {
        setErrorMsg(createTemplateData.message);
        Message.error({
          content: t(Strings.template_creation_failed),
        });
      }
    }
  }, [createTemplateData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) {
      setErrorMsg('');
    }
    if (e.target.value.length > ConfigConstant.TEMPLATE_NAME_MAX) {
      setErrorMsg(t(Strings.template_name_limit));
    }
    setName(e.target.value);
  };

  const handleOk = async () => {
    const result = await templateNameValidate(name);
    if (result) {
      Modal.confirm({
        type: 'danger',
        title: t(Strings.template_name_repetition_title, { templateName: name }),
        content: t(Strings.template_name_repetition_content),
        onOk: () => {
          createTemplate(nodeId!, name);
        },
      });
    } else {
      createTemplate(nodeId!, name);
    }
  };

  return (
    <BaseModal
      width={419}
      title={t(Strings.save_as_template)}
      onCancel={onCancel}
      okButtonProps={{
        loading,
        disabled: Boolean(errorMsg),
      }}
      onOk={handleOk}
    >
      <Form onFinish={handleOk}>
        <div className={styles.generateTemplateContent}>
          <div className={styles.tip}>{t(Strings.template_name)}</div>
          <Input className={errorMsg ? 'error' : ''} value={name} onChange={handleChange} placeholder={t(Strings.enter_template_name)} autoFocus />
          <div className={styles.errorMsg}>{errorMsg}</div>
        </div>
      </Form>
    </BaseModal>
  );
};
