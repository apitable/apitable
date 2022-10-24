import { memo, FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Selectors, StatusCode, Strings, t } from '@apitable/core';
import { NoPermission } from '../no_permission';
import { ViewContainer } from './view_container';
import classNames from 'classnames';
import styles from './style.module.less';
import { ServerError } from '../invalid_page/server_error';
import { useWeixinShare } from 'pc/hooks';
import { TabBar } from './form_tab';
import { ShareContext } from 'pc/components/share/share';

const FormPanelBase: FC<{loading?: boolean}> = props => {
  const { shareId, templateId } = useSelector(state => state.pageParams);
  const formErrCode = useSelector(state => Selectors.getFormErrorCode(state));
  const loading = useSelector(state => {
    const form = Selectors.getForm(state);
    const formLoading = Selectors.getFormLoading(state);
    return Boolean(!form) || formLoading;
  });

  const isNoPermission = (
    formErrCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST ||
    formErrCode === StatusCode.FORM_DATASHEET_NOT_EXIST ||
    formErrCode === StatusCode.NOT_PERMISSION ||
    formErrCode === StatusCode.NODE_NOT_EXIST ||
    formErrCode === StatusCode.NODE_DELETED
  );
  const { shareInfo } = useContext(ShareContext);
  const userLoading = useSelector(state => state.user.loading);

  useWeixinShare();

  const noPermissionDesc = formErrCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST ? t(Strings.current_form_is_invalid) : '';

  return (
    <div
      className={classNames(styles.formSpace, loading && styles.loading)}
      style={{
        borderRadius: (shareId && shareInfo.isFolder) || templateId ? 8 : 0,
      }}
    >
      {
        !formErrCode ? (
          <>
            {
              !shareId && <TabBar loading={loading} />
            }
            <ViewContainer loading={loading || (shareId && (!shareInfo || userLoading)) || props.loading} />
          </>
        ) : (isNoPermission ? <NoPermission desc={noPermissionDesc} /> : <ServerError />)
      }
    </div>
  );
};

export const FormPanel = memo(FormPanelBase);
