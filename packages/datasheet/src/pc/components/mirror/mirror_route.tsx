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

import { useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Skeleton } from '@apitable/components';
import { Navigation, Selectors, StatusCode, Strings, t } from '@apitable/core';
import { ServerError } from 'pc/components/invalid_page/server_error';
import { Mirror } from 'pc/components/mirror/mirror';
import styles from 'pc/components/mirror/style.module.less';
import { NoPermission } from 'pc/components/no_permission';
import { Router } from 'pc/components/route_manager/router';

import { useAppSelector } from 'pc/store/react-redux';

export const MirrorRoute = () => {
  const { mirrorId, shareId, datasheetId, templateId, categoryId } = useAppSelector((state) => state.pageParams)!;
  const mirrorSourceInfo = useAppSelector((state) => {
    return Selectors.getMirrorSourceInfo(state, mirrorId!);
  });
  const recordId = useAppSelector((state) => {
    return state.pageParams.recordId;
  });
  const mirror = useAppSelector((state) => {
    return Selectors.getMirror(state, mirrorId!);
  });
  const sourceDatasheet = useAppSelector((state) => {
    if (!mirror) {
      return;
    }
    return Selectors.getDatasheet(state, mirror.sourceInfo.datasheetId);
  });

  useEffect(() => {
    if (!mirrorSourceInfo) {
      return;
    }
    // The mirror route is special compared to other nodes, in order to maintain the mapping relationship,
    // an additional datasheetId will be displayed on the route, so here for the mirror jump will do special treatment
    if (shareId) {
      Router.push(Navigation.SHARE_SPACE, {
        params: { shareId, nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
      });
      return;
    }
    if (templateId) {
      Router.push(Navigation.TEMPLATE, {
        params: { categoryId, templateId, nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
      });
      return;
    }
    Router.push(Navigation.WORKBENCH, {
      params: { nodeId: mirrorId, datasheetId: mirrorSourceInfo?.datasheetId, viewId: mirrorSourceInfo?.viewId, recordId },
    });
  }, [mirrorSourceInfo, mirrorId, categoryId, shareId, templateId, recordId, datasheetId]);

  const errorCode = useAppSelector((state) => {
    return (
      Selectors.getMirrorErrorCode(state, mirrorId!) ||
      (mirrorSourceInfo?.datasheetId && Selectors.getDatasheetErrorCode(state, mirrorSourceInfo.datasheetId))
    );
  });

  /**
   * Here we mainly deal with the exception status:
   * 1. mirror node is deleted
   * 2. mirror The dependent source datasheet is deleted
   */
  const isNoPermission =
    errorCode === StatusCode.NODE_NOT_EXIST ||
    errorCode === StatusCode.NOT_PERMISSION ||
    errorCode === StatusCode.NODE_DELETED ||
    errorCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST;

  if (errorCode) {
    return isNoPermission ? (
      <NoPermission desc={errorCode === StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST ? t(Strings.mirror_resource_dst_been_deleted) : undefined} />
    ) : (
      <ServerError />
    );
  }
  if (!mirror || !sourceDatasheet || !datasheetId || sourceDatasheet.isPartOfData) {
    return (
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width, height }) => {
          return (
            <div className={styles.skeletonWrapper} style={{ width, height }}>
              <Skeleton height="24px" />
              <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
            </div>
          );
        }}
      </AutoSizer>
    );
  }

  // The source datasheet is not deleted, the mirror node is not deleted, but the view from which the source datasheet generates the mirror is deleted
  if (sourceDatasheet && !sourceDatasheet.snapshot.meta.views.find((item) => item.id === mirrorSourceInfo?.viewId)) {
    return <NoPermission desc={t(Strings.mirror_resource_view_been_deleted)} />;
  }

  return <Mirror mirror={mirror} />;
};
