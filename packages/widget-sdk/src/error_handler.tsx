import React from 'react';
import { useSelector } from 'react-redux';
import { Selectors, StatusCode, Strings, t } from 'core';
import { WidgetEmptyPath } from './ui/widget_empty';
import { getWidgetDatasheet } from 'store';
import { IReduxState } from '@apitable/core';
import { useMeta } from 'hooks';

export const ErrorHandler: React.FC = props => {
  let errorCode = useSelector(state => {
    const sourceId = state.widget?.snapshot.sourceId;
    const widgetState = state as any as IReduxState;
    if (sourceId?.startsWith('mir')) {
      return Selectors.getMirrorPack(widgetState, sourceId || '')?.errorCode;
    }

    if (state.errorCode) {
      return state.errorCode;
    }

    return null;
  });

  const { sourceId } = useMeta();
  const isLoading = useSelector(state => {
    if (errorCode) {
      return false;
    }
    if (sourceId?.startsWith('mir')) {
      return !state.mirrorMap?.[sourceId]?.mirror || !(getWidgetDatasheet(state) && state.widget?.snapshot);
    }
    return !(getWidgetDatasheet(state) && state.widget?.snapshot);
  });

  // 这里拦截一下在镜像有权限源表无权限的情况下，由于 loading 完成，但是镜像的加载导致源表数据导致会覆盖掉datasheet源表的errorCode产生的权限穿透
  errorCode = useSelector(state => {
    const datasheet = getWidgetDatasheet(state);
    if (!errorCode && !isLoading && !sourceId?.startsWith('mir') && !datasheet?.permissions.readable) {
      return StatusCode.NODE_NOT_EXIST;
    }
    return errorCode;
  });

  if (isLoading) {
    return <h1
      style={{
        fontSize: 14,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      loading……
    </h1>;
  }

  const getErrorTip = () => {
    switch (errorCode) {
      case StatusCode.NODE_DELETED:
        return t(Strings.widget_datasheet_has_delete);
      case StatusCode.NODE_NOT_EXIST:
        return t(Strings.widget_no_access_datasheet);
      default:
        return t(Strings.widget_unknow_err, {
          info: errorCode,
        });
    }
  };

  if (errorCode) {
    return <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '100%',
      }}
    >
      <div
        style={{
          background: `url('data:image/svg+xml;utf8,${encodeURIComponent(WidgetEmptyPath)}') center no-repeat`,
          backgroundSize: '160px 120px',
          width: 160,
          height: 120,
          margin: '0 auto',
        }}
      />
      <p
        style={{
          textAlign: 'center',
          fontSize: 14,
        }}
      >
        {
          getErrorTip()
        }，
        <a href={t(Strings.dashboard_access_denied_help_link)} target="_blank" rel="noopener noreferrer" style={{
          borderBottom: '1px solid',
          paddingBottom: 2,
        }}>
          {t(Strings.know_more)}
        </a>
      </p>
    </div>;
  }
  return (props.children || null) as any;
};

