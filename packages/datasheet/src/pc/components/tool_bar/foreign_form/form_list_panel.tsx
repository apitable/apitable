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
import Image from 'next/image';
import { FC } from 'react';
import { Button, Skeleton, TextButton, useThemeColors } from '@apitable/components';
import { ConfigConstant, DATASHEET_ID, Navigation, Strings, t, ThemeName } from '@apitable/core';
import { AddOutlined, FormOutlined, QuestionCircleOutlined } from '@apitable/icons';

// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useCatalog } from 'pc/hooks/use_catalog';
import { useAppSelector } from 'pc/store/react-redux';
import FormEmptyDark from 'static/icon/common/form_empty_dark.png';
import FormEmptyLight from 'static/icon/common/form_empty_light.png';
import styles from './style.module.less';

export interface IFormNodeItem {
  nodeId: string;
  nodeName: string;
  type: number;
}

interface IFormListPanelProps {
  spaceId: string;
  folderId: string;
  datasheetId: string;
  viewId: string;
  viewName?: string;
  loading: boolean;
  creatable: boolean;
  formList: IFormNodeItem[];
}

export const FormListPanel: FC<React.PropsWithChildren<IFormListPanelProps>> = (props) => {
  const { spaceId, folderId, datasheetId, viewId, formList, loading, creatable, viewName } = props;
  const colors = useThemeColors();
  const { addTreeNode } = useCatalog();
  const isEmpty = !formList?.length;
  const theme = useAppSelector((state) => state.theme);
  const EmptyState = theme === ThemeName.Light ? FormEmptyLight : FormEmptyDark;

  const addForm = () => {
    addTreeNode(
      folderId,
      ConfigConstant.NodeType.FORM,
      {
        datasheetId,
        viewId,
      },
      viewName ? `${viewName}${t(Strings.key_of_adjective)}${t(Strings.view_form)}` : undefined,
    );
  };

  const renderSkeleton = () => {
    return (
      <div className={styles.skeletonWrapper}>
        <Skeleton style={{ height: 20, marginBottom: 8 }} />
        <Skeleton style={{ height: 30, marginBottom: 8 }} />
        <Skeleton style={{ height: 30 }} />
      </div>
    );
  };

  const onJump = (formId: string) => {
    Router.push(Navigation.WORKBENCH, { params: { spaceId, formId } });
  };

  const renderFormList = () => {
    if (isEmpty) {
      return (
        <div className={styles.emptyContent}>
          <span className={styles.emptyImg}>
            <Image src={EmptyState} alt={''} />
          </span>
          <span className={styles.emptyText}>{t(Strings.view_foreign_form_empty)}</span>
        </div>
      );
    }

    return formList.map((form) => {
      return (
        <div key={form.nodeId} className={styles.formItem} onClick={() => onJump(form.nodeId)}>
          <FormOutlined size={16} color={colors.thirdLevelText} />
          <span className={styles.formName}>{form.nodeName}</span>
        </div>
      );
    });
  };

  return (
    <div className={styles.panelContainer} id={DATASHEET_ID.FORM_LIST_PANEL}>
      <h4 className={styles.header}>
        {t(Strings.view_form)}
        <Tooltip title={t(Strings.form_tour_desc)}>
          <a href={t(Strings.form_tour_link)} className={styles.helpBtn} target="_blank" rel="noreferrer">
            <QuestionCircleOutlined color={colors.fc3} />
          </a>
        </Tooltip>
      </h4>
      <div className={styles.content} style={{ paddingBottom: creatable ? 0 : '16px' }}>
        {loading ? renderSkeleton() : renderFormList()}
      </div>
      {creatable && (
        <div
          className={classnames(styles.footer, {
            [styles.notEmpty]: !isEmpty,
          })}
        >
          {isEmpty ? (
            <Button className={styles.addBtn} block={!isEmpty} color="primary" size="middle" onClick={addForm}>
              {!isEmpty && <AddOutlined size={16} color={colors.secondLevelText} className={styles.addIcon} />}
              {t(Strings.current_view_add_form)}
            </Button>
          ) : (
            <TextButton className={styles.addBtn} block style={{ height: '100%' }} onClick={addForm}>
              {!isEmpty && <AddOutlined size={16} color={colors.secondLevelText} className={styles.addIcon} />}
              {t(Strings.current_view_add_form)}
            </TextButton>
          )}
        </div>
      )}
    </div>
  );
};
