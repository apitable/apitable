import { Button, Skeleton, TextButton, useThemeColors } from '@vikadata/components';
import { ConfigConstant, DATASHEET_ID, Navigation, Strings, t } from '@vikadata/core';
import { InformationLargeOutlined } from '@vikadata/icons';
import classnames from 'classnames';

import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useCatalog } from 'pc/hooks/use_catalog';
import { FC } from 'react';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import EmptyState from 'static/icon/datasheet/form/emptystate.png';
import FormIcon from 'static/icon/datasheet/toolbar_form.svg';
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

export const FormListPanel: FC<IFormListPanelProps> = (props) => {
  const {
    spaceId,
    folderId,
    datasheetId,
    viewId,
    formList,
    loading,
    creatable,
    viewName,
  } = props;
  const colors = useThemeColors();
  const { addTreeNode } = useCatalog();
  const isEmpty = !formList?.length;

  const addForm = () => {
    addTreeNode(
      folderId,
      ConfigConstant.NodeType.FORM,
      {
        datasheetId,
        viewId,
      },
      viewName ? `${viewName}${t(Strings.key_of_adjective)}${t(Strings.vika_form)}` : undefined,
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

  const onJump = (formId) => {
    Router.push(Navigation.WORKBENCH, { params: { spaceId, formId }});
  };

  const renderFormList = () => {
    if (isEmpty) {
      return (
        <div className={styles.emptyContent}>
          <span className={styles.emptyImg}>
            <Image src={EmptyState} alt={''} />

          </span>
          <span className={styles.emptyText}>
            {t(Strings.view_foreign_form_empty)}
          </span>
        </div>
      );
    }

    return (
      formList.map(form => {
        return (
          <div
            key={form.nodeId}
            className={styles.formItem}
            onClick={() => onJump(form.nodeId)}
          >
            <FormIcon
              width={16}
              height={16}
              fill={colors.thirdLevelText}
            />
            <span className={styles.formName}>
              {form.nodeName}
            </span>
          </div>
        );
      })
    );
  };

  return (
    <div className={styles.panelContainer} id={DATASHEET_ID.FORM_LIST_PANEL}>
      <h4 className={styles.header}>
        {t(Strings.vika_form)}
        <Tooltip title={t(Strings.form_tour_desc)}>
          <a href={t(Strings.form_tour_link)} className={styles.helpBtn} target='_blank' rel='noreferrer'>
            <InformationLargeOutlined color={colors.fc3} />
          </a>
        </Tooltip>
      </h4>
      <div className={styles.content} style={{ paddingBottom: creatable ? 0 : '16px' }}>
        {
          loading ?
            renderSkeleton() :
            renderFormList()
        }
      </div>
      {
        creatable && <div className={classnames(styles.footer, {
          [styles.notEmpty]: !isEmpty,
        })}>
          {isEmpty ? (
            <Button
              className={styles.addBtn}
              block={!isEmpty}
              color='primary'
              size='middle'
              onClick={addForm}
            >
              {!isEmpty && <IconAdd width={16} height={16} fill={colors.secondLevelText} className={styles.addIcon} />}
              {t(Strings.current_view_add_form)}
            </Button>
          ) : (
            <TextButton
              className={styles.addBtn}
              block
              style={{ height: '100%' }}
              onClick={addForm}
            >
              {!isEmpty && <IconAdd width={16} height={16} fill={colors.secondLevelText} className={styles.addIcon} />}
              {t(Strings.current_view_add_form)}
            </TextButton>
          )}
        </div>
      }
    </div>
  );
};
