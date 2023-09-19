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

import { message, Spin } from 'antd';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Range, Transforms } from 'slate';
import { ReactEditor, useFocused, useReadOnly, useSlate } from 'slate-react';
import { useThemeColors } from '@apitable/components';
import { DeleteOutlined, LoadingOutlined } from '@apitable/icons';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { getElementDataset } from 'pc/utils';
import * as API from '../../api';
import { updateElementData, updateImage } from '../../commands';
// import cx from 'classnames';
import { FilePicker, IPreviewFile } from '../../components/file_picker';
import Icons from '../../components/icons';
import { ALIGN, IMAGE_MIN_WIDTH } from '../../constant';
import { EditorContext } from '../../context';
import { getCurrentElement, getImgData } from '../../helpers/utils';
import { IEventBusEditor, IMousePosition } from '../../interface/editor';
import { IElement, IElementRenderProps, IImageElementData } from '../../interface/element';
import { BUILT_IN_EVENTS } from '../../plugins/withEventBus';
// import Decorate from '../element_decorate';
import styles from './style.module.less';

const Image = React.memo(({ children, element }: IElementRenderProps<IElement<IImageElementData>>) => {
  const colors = useThemeColors();
  const elementData = useMemo(() => element.data || {}, [element.data]);
  const originAlign = useMemo(() => elementData.align || ALIGN.LEFT, [elementData.align]);
  const { url: _url, name, width: originWidth } = elementData;
  const url = useGetSignatureAssertByToken(_url || null);
  const focused = useFocused();
  const readOnly = useReadOnly();
  const editor = useSlate() as ReactEditor & IEventBusEditor;
  const { i18nText } = useContext(EditorContext);

  const [moveable, setMoveable] = useState(false);
  const [moving, setMoving] = useState(false);
  const [imgDisplayWidth, setImgDisplayWidth] = useState(originWidth);
  const [uploading, setUploading] = useState(false);
  const startStatus = useRef({ width: 0, triggerHandle: 'right', point: { x: 0, y: 0 } });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);

  let focusedElement: IElement | null = null;
  if (focused && editor.selection && Range.isCollapsed(editor.selection)) {
    focusedElement = getCurrentElement(editor);
  }
  const isFocusedInSelf = focusedElement && element._id === focusedElement._id;
  const hasImg = !!url;

  const handleFileChange = useCallback(
    (_file: any) => {
      const file = _file as IPreviewFile;
      const successFunc = (url = file.preview) => {
        const nextData = {
          ...elementData,
          ...getImgData(file, url),
        };
        updateImage(editor, nextData);
      };
      const uploader = API.getApi(editor, API.ApiKeys.ImageUpload);
      if (uploader) {
        setUploading(true);
        uploader(file)
          .then((res: API.IImageResponse) => {
            successFunc((res as API.IImageResponse).imgUrl);
          })
          .finally(() => {
            setUploading(false);
          });

        return;
      }
      successFunc();
    },
    [editor, elementData],
  );

  const handleImagePickerError = useCallback(
    (type: any) => {
      if (type === 'size') {
        message.error(i18nText.imageSizeError);
      } else {
        message.error(i18nText.imageTypeError);
      }
    },
    [i18nText],
  );

  const moveHandleMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current || readOnly) {
      return;
    }
    const target = e.currentTarget as HTMLElement;
    const isRight = getElementDataset(target, 'isRight') === 'true';
    startStatus.current.width = imgRef.current.offsetWidth;
    startStatus.current.triggerHandle = isRight ? 'right' : 'left';
    startStatus.current.point = { x: e.pageX, y: e.pageY };
    setMoveable(true);
  };

  const handleEditorMouseMove = useCallback(
    (point: IMousePosition) => {
      if (!moveable) {
        return;
      }
      let diffX = point.x - startStatus.current.point.x;
      // Prevents small slips from causing jitter
      if (Math.abs(diffX) > 5) {
        setMoving(true);
      }
      if (startStatus.current.triggerHandle === 'left') {
        diffX = -diffX;
      }
      let nextWidth = Math.max(Math.floor(startStatus.current.width + diffX), IMAGE_MIN_WIDTH);
      const wrapWidth = imgWrapRef.current && imgWrapRef.current.offsetWidth;
      if (wrapWidth) {
        nextWidth = Math.min(nextWidth, wrapWidth);
      }
      setImgDisplayWidth(nextWidth);
    },
    [moveable],
  );

  const handleEnd = useCallback(() => {
    setMoveable(false);
    if (moving) {
      setMoving(false);
      updateElementData(editor, { width: imgDisplayWidth });
    }
  }, [setMoveable, setMoving, moving, imgDisplayWidth, editor]);

  const handleImgPickerWrapMouseDown = useCallback(() => {
    if (readOnly) {
      return;
    }
    try {
      const path = ReactEditor.findPath(editor, element);
      Transforms.select(editor, path);
    } catch (error) {
      console.log(error);
    }
  }, [editor, element, readOnly]);

  // Preventing dragging of images
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDeleteImg = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const path = ReactEditor.findPath(editor, element);
        Transforms.removeNodes(editor, { at: path });
      } catch (error) {
        console.log(error);
      }
    },
    [editor, element],
  );

  const handleChangeImgAlign = useCallback(
    (e: React.MouseEvent<HTMLDListElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.currentTarget;
      if (!target) {
        return;
      }
      try {
        const path = ReactEditor.findPath(editor, element);
        const align = getElementDataset(target, 'align') as ALIGN;
        updateElementData(editor, { align }, path);
      } catch (error) {
        console.log(error);
      }
    },
    [editor, element],
  );

  useEffect(() => {
    editor.on(BUILT_IN_EVENTS.EDITOR_MOUSE_MOVE, handleEditorMouseMove);

    return () => {
      editor.off(BUILT_IN_EVENTS.EDITOR_MOUSE_MOVE, handleEditorMouseMove);
    };
  }, [handleEditorMouseMove, editor]);

  useEffect(() => {
    editor.on(BUILT_IN_EVENTS.EDITOR_MOUSE_UP, handleEnd);
    editor.on(BUILT_IN_EVENTS.EDITOR_MOUSE_LEAVE, handleEnd);

    return () => {
      editor.off(BUILT_IN_EVENTS.EDITOR_MOUSE_UP, handleEnd);
      editor.off(BUILT_IN_EVENTS.EDITOR_MOUSE_LEAVE, handleEnd);
    };
  }, [handleEnd, editor]);

  useEffect(() => {
    if (originWidth && Number.isInteger(originWidth)) {
      if (imgWrapRef.current && originWidth > imgWrapRef.current.offsetWidth) {
        setImgDisplayWidth(imgWrapRef.current.offsetWidth);
      }
    }
    // Make sure to correct the width only when rendering for the first time
    // eslint-disable-next-line
  }, []);

  const content = hasImg ? (
    <div className={styles.imageWrap} data-read-only={readOnly} onDragStart={handleDragStart} data-focused={isFocusedInSelf}>
      <div className={styles.imageOperationMask}>
        <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="tl" data-is-right="false" />
        <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="tr" data-is-right="true" />
        <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="bl" data-is-right="false" />
        <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="br" data-is-right="true" />
        {/* Inline Toolbar */}
        <dl className={styles.embedToolbar}>
          <dd data-active={originAlign === ALIGN.LEFT} data-align={ALIGN.LEFT} onMouseDown={handleChangeImgAlign}>
            <Icons.alignLeft />
          </dd>
          <dd data-active={originAlign === ALIGN.CENTER} data-align={ALIGN.CENTER} onMouseDown={handleChangeImgAlign}>
            <Icons.alignCenter />
          </dd>
          <dd data-active={originAlign === ALIGN.RIGHT} data-align={ALIGN.RIGHT} onMouseDown={handleChangeImgAlign}>
            <Icons.alignRight />
          </dd>
          <dd className={styles.divider} />
          <dd onMouseDown={handleDeleteImg}>
            <DeleteOutlined color={colors.secondLevelText} />
          </dd>
        </dl>
      </div>
      <img
        ref={imgRef}
        onDragStart={handleDragStart}
        src={url}
        alt={name}
        className={styles.img}
        style={{
          width: imgDisplayWidth || '100%',
        }}
      />
    </div>
  ) : (
    <FilePicker
      onChange={handleFileChange}
      onError={handleImagePickerError}
      disabled={uploading}
      needPreview
      accept="image/*"
      limitSize={1024 * 1024 * 2}
    >
      <div className={styles.imgPicker} data-focused={isFocusedInSelf}>
        {uploading && (
          <div className={styles.loadingMask}>
            <Spin tip={i18nText.imageUploading} size="small" indicator={<LoadingOutlined className="circle-loading" />} />
          </div>
        )}
        <Icons.image />
        <span className={styles.imgPlaceholder}>{i18nText.addImage}</span>
        <span onMouseDown={handleDeleteImg}>
          <DeleteOutlined color={colors.secondLevelText} className={styles.deleteBtn} />
        </span>
      </div>
    </FilePicker>
  );

  return (
    <div ref={imgWrapRef} className={styles.imagePickerWrap} data-align={originAlign} onMouseDown={handleImgPickerWrapMouseDown}>
      <div contentEditable={false} className={styles.imageContent}>
        {content}
      </div>
      {/* Even elements of type void must require children */}
      {children}
    </div>
  );
});

export default Image;
