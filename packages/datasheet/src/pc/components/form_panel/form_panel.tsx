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

import { memo, FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Selectors, StatusCode, Strings, t } from '@apitable/core';
import { NoPermission } from '../no_permission';
import { ViewContainer } from './view_container';
import classNames from 'classnames';
import styles from './style.module.less';
import { ServerError } from '../invalid_page/server_error';
import { TabBar } from './form_tab';
import { ShareContext } from 'pc/components/share/share';
// @ts-ignore
import { WeixinShareWrapper } from 'enterprise';

const FormPanelBase: FC<React.PropsWithChildren<{loading?: boolean}>> = props => {
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

  const noPermissionDesc = formErrCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST ? t(Strings.current_form_is_invalid) : '';

  const childComponent = (
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

  return (
    <>
      {
        WeixinShareWrapper ? (
          <WeixinShareWrapper>
            {childComponent}
          </WeixinShareWrapper>
        ) : childComponent
      }
    </>
  );
};

export const FormPanel = memo(FormPanelBase);
