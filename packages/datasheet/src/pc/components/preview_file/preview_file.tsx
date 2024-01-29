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

import { useKeyPress, useMount, useToggle, useUnmount } from 'ahooks';
import classNames from 'classnames';

import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, shallowEqual } from 'react-redux';
import { stopPropagation, ThemeProvider } from '@apitable/components';
import { FieldType, handleNullArray, IAttachmentValue, IReduxState, Selectors, StoreActions } from '@apitable/core';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { ContextName, ShortcutContext } from 'modules/shared/shortcut_key';
import { useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { KeyCode } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { dispatch } from 'pc/worker/store';
import { ScreenSize } from '../common/component_display';
import { IExpandPreviewModalFuncProps } from './preview_file.interface';
import { PreviewMain } from './preview_main';
import { isFocusingInput } from './preview_main/util';
// @ts-ignore
import { OFFICE_APP_ID } from 'enterprise/marketing/marketing';
import styles from './style.module.less';

interface IPreviewFileModal {
  onClose: () => void;
}

const PreviewFileModal: React.FC<React.PropsWithChildren<IPreviewFileModal>> = (props) => {
  const { onClose } = props;
  const [isFullScreen, { toggle: toggleIsFullScreen }] = useToggle(false);
  const previewFile = useAppSelector((state) => state.previewFile, shallowEqual);
  const { datasheetId, recordId, fieldId, activeIndex, editable, onChange, disabledDownload } = previewFile;
  let _cellValue = previewFile.cellValue;

  if (datasheetId && recordId && fieldId) {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (snapshot) {
      const fieldMap = snapshot.meta.fieldMap;
      const field = fieldMap[fieldId];
      if (field && Selectors.findRealField(state, field)?.type === FieldType.Attachment) {
        _cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      } else {
        _cellValue = []; // Trigger the closing of pop-up windows
      }
    }
  }

  const { userInfo, marketplaceApps, spaceId, shareInfo, rightPaneWidth, isSideRecordOpen, isRecordFullScreen, shareId, templateId } = useAppSelector(
    (state: IReduxState) => {
      return {
        spaceId: state.space.activeId,
        userInfo: state.user.info,
        shareInfo: state.share,
        marketplaceApps: state.space.marketplaceApps,
        rightPaneWidth: state.rightPane.width,
        isSideRecordOpen: state.space.isSideRecordOpen,
        isRecordFullScreen: state.space.isRecordFullScreen,
        shareId: state.pageParams.shareId,
        templateId: state.pageParams.templateId,
      };
    },
    shallowEqual,
  );
  const dispatch = useAppDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { IS_ENTERPRISE } =getEnvVariables();

  const _spaceId = spaceId || shareInfo?.spaceId || getEnvVariables().TEMPLATE_SPACE_ID!;
  useEffect(() => {
    IS_ENTERPRISE && spaceId && dispatch(StoreActions.fetchMarketplaceApps(spaceId));
  }, [dispatch, spaceId]);

  const officePreviewEnable = marketplaceApps.find((app) => app.appId === OFFICE_APP_ID)?.status ? true : false;

  const setActiveIndex = useCallback(
    (activeIndex: number) => {
      dispatch(
        StoreActions.setPreviewFile({
          ...previewFile,
          activeIndex,
        }),
      );
    },
    [dispatch, previewFile],
  );

  const cellValueWithoutNull: typeof _cellValue = useMemo(() => {
    if (!_cellValue) return [];
    return handleNullArray(_cellValue.flat(1)) || [];
  }, [_cellValue]);

  const cellValue = useGetSignatureAssertByToken(cellValueWithoutNull);
  const readonly = !editable;

  const onDelete = useCallback(() => {
    if (readonly) {
      return;
    }
    const filteredCellValue = cellValue.filter((item: any) => item.id !== cellValue[activeIndex].id);
    onChange(filteredCellValue);
    const lastIndex = filteredCellValue.length - 1;
    if (activeIndex > lastIndex) {
      setActiveIndex(lastIndex);
    }
    if (cellValue.length === 1) {
      onClose();
      return;
    }
  }, [activeIndex, cellValue, onChange, onClose, readonly, setActiveIndex]);

  useEffect(() => {
    if (!cellValue || cellValue.length === 0) {
      return;
    }

    if (containerRef.current) {
      containerRef.current!.focus();
    }

    // eslint-disable-next-line
  }, [cellValue, activeIndex]);

  // activeIndex prevents out-of-range
  useEffect(() => {
    if (cellValue.length === 0) {
      onClose();
    } else if (activeIndex >= cellValue.length) {
      setActiveIndex(cellValue.length - 1);
    }
  }, [activeIndex, cellValue.length, onClose, setActiveIndex]);

  const containerRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    dispatch(StoreActions.setPreviewModalVisible(true));
  });

  useUnmount(() => dispatch(StoreActions.setPreviewModalVisible(false)));

  useKeyPress(KeyCode.Esc, onClose);
  useKeyPress(KeyCode.Space, () => {
    if (!isFocusingInput()) {
      onClose();
    }
  });

  useEffect(() => {
    ShortcutContext.bind(ContextName.modalVisible, () => true);
    return () => {
      ShortcutContext.unbind(ContextName.modalVisible);
    };
  });

  // Adjust width to handle when expand record in side
  const marginRight = (() => {
    const OFFSET_RIGHT = 3; // Offset width of the drag line
    const WRAP_RIGHT = 15; // Offset to the right of the share or template page

    let width = 0;
    // If there is a centered record card, display it full screen
    if (isFullScreen || !isSideRecordOpen || isMobile || isRecordFullScreen || document.querySelector('.centerExpandRecord')) {
      return width;
    }
    if (typeof rightPaneWidth === 'number') {
      width = rightPaneWidth + OFFSET_RIGHT;
      if (shareId || templateId) width += WRAP_RIGHT;
      return width;
    }
    return rightPaneWidth;
  })();

  return (
    <div
      className={classNames(styles.previewWrapper, 'previewWrapperContainer')}
      style={{ marginRight }}
      ref={containerRef}
      draggable={false}
      tabIndex={0}
      onMouseDown={stopPropagation}
    >
      {cellValue[activeIndex] != null && (
        <PreviewMain
          files={cellValue}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          onClose={onClose}
          onDelete={onDelete}
          readonly={readonly}
          userInfo={userInfo}
          spaceId={_spaceId}
          officePreviewEnable={officePreviewEnable}
          disabledDownload={disabledDownload}
          isFullScreen={isFullScreen}
          toggleIsFullScreen={toggleIsFullScreen}
        />
      )}
    </div>
  );
};

export interface IExpandPreviewModalRef {
  update: (props: IExpandPreviewModalFuncProps) => IExpandPreviewModalRef;
}

let preCloseModalFn = () => {};

export const expandPreviewModalClose = () => {
  preCloseModalFn();
  preCloseModalFn = () => {};
};

export const expandPreviewModal = (props: IExpandPreviewModalFuncProps): IExpandPreviewModalRef => {
  preCloseModalFn();
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  const close = () => {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    dispatch(StoreActions.setPreviewFileDefault());
  };
  preCloseModalFn = close;

  const render = (props: IExpandPreviewModalFuncProps) => {
    dispatch(
      StoreActions.setPreviewFile({
        ...props,
        onChange: (files: IAttachmentValue[]) => {
          props.onChange(files);
          if (files.length > 0) {
            update({
              ...props,
              cellValue: files,
            });
          }
        },
      }),
    );

    root.render(
      <Provider store={store}>
        <ThemeProvider>
          <PreviewFileModal onClose={close} />
        </ThemeProvider>
      </Provider>,
    );
  };

  const update = (updatedProps: IExpandPreviewModalFuncProps) => {
    render(updatedProps);

    return {
      update,
    };
  };

  render(props);

  return {
    update,
  };
};
