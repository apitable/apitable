import { useThemeColors } from '@vikadata/components';
import { DeleteOutlined } from '@vikadata/icons';
import { message, Spin } from 'antd';
import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import { getElementDataset } from 'pc/utils';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Range, Transforms } from 'slate';
import { ReactEditor, useFocused, useReadOnly, useSlate } from 'slate-react';
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

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });
const Image = React.memo(({ children, element }: IElementRenderProps<IElement<IImageElementData>>) => {
  const colors = useThemeColors();
  const elementData = useMemo(() => element.data || {}, [element.data]);
  const originAlign = useMemo(() => elementData.align || ALIGN.LEFT, [elementData.align]);
  const { url, name, width: originWidth } = elementData;
  const focused = useFocused();
  const readOnly = useReadOnly();
  const editor = useSlate() as ReactEditor & IEventBusEditor;
  const { i18nText } = useContext(EditorContext);

  const [moveable, setMoveable] = useState(false);
  const [moving, setMoving] = useState(false);
  const [imgDisplayWidth, setImgDisplayWidth] = useState(originWidth);
  const [uploading, setUploading] = useState(false);
  const startStatus = useRef({ width: 0, triggerHandle: 'right', point: { x: 0, y: 0 }});
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);

  let focusedElement: IElement | null = null;
  if (focused && editor.selection && Range.isCollapsed(editor.selection)) {
    focusedElement = getCurrentElement(editor);
  }
  const isFocusedInSelf = focusedElement && element._id === focusedElement._id;
  const hasImg = !!url;

  const handleFileChange = useCallback((_file) => {
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
        .then((res) => {
          successFunc((res as API.IImageResponse).imgUrl);
        })
        .finally(() => {
          setUploading(false);
        });

      return;
    }
    successFunc();
  }, [editor, elementData]);

  const handleImagePickerError = useCallback((type) => {
    if (type === 'size') {
      message.error(i18nText.imageSizeError);
    } else {
      message.error(i18nText.imageTypeError);
    }
  }, [i18nText]);

  // 开始拖动
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

  // 拖动实时更新宽度
  const handleEditorMouseMove = useCallback((point: IMousePosition) => {
    if (!moveable) {
      return;
    }
    let diffX = point.x - startStatus.current.point.x;
    // 防止微小的滑动造成抖动
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
  }, [moveable]);

  // 拖动完成
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

  // 防止拖动图片
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
  }, []);

  const handleDeleteImg = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const path = ReactEditor.findPath(editor, element);
      Transforms.removeNodes(editor, { at: path });
    } catch (error) {
      console.log(error);
    }
  }, [editor, element]);

  const handleChangeImgAlign = useCallback((e: React.MouseEvent<HTMLDListElement>) => {
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
  }, [editor, element]);

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
    // 确定只需在渲染首次纠正宽度
    // eslint-disable-next-line
  }, []);

  const content = (
    hasImg
      ? <div className={styles.imageWrap} data-read-only={readOnly} onDragStart={handleDragStart} data-focused={isFocusedInSelf}>
        <div className={styles.imageOperationMask}>
          <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="tl" data-is-right="false" />
          <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="tr" data-is-right="true" />
          <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="bl" data-is-right="false" />
          <i className={styles.moveHandle} onMouseDown={moveHandleMouseDown} data-placement="br" data-is-right="true" />
          {/* 内嵌工具栏 */}
          <dl className={styles.embedToolbar}>
            <dd data-active={originAlign === ALIGN.LEFT} data-align={ALIGN.LEFT} onMouseDown={handleChangeImgAlign}><Icons.alignLeft /></dd>
            <dd data-active={originAlign === ALIGN.CENTER} data-align={ALIGN.CENTER} onMouseDown={handleChangeImgAlign}><Icons.alignCenter /></dd>
            <dd data-active={originAlign === ALIGN.RIGHT} data-align={ALIGN.RIGHT} onMouseDown={handleChangeImgAlign}><Icons.alignRight /></dd>
            <dd className={styles.divider} />
            <dd onMouseDown={handleDeleteImg}><DeleteOutlined color={colors.secondLevelText} /></dd>
          </dl>
        </div>
        <span
          ref={imgRef}
          onDragStart={handleDragStart}
          className={styles.imgWrapper}
        >
          <NextImage
            src={url}
            alt={name}
            layout={'fill'}
            className={styles.img}
            style={{
              width: imgDisplayWidth || '100%'
            }}
          />
        </span>

      </div>
      : <FilePicker
        onChange={handleFileChange}
        onError={handleImagePickerError}
        disabled={uploading}
        needPreview
        accept="image/*"
        limitSize={1024 * 1024 * 2}>
        <div className={styles.imgPicker} data-focused={isFocusedInSelf}>
          {uploading && <div className={styles.loadingMask}>
            <Spin tip={i18nText.imageUploading} size="small" indicator={<LoadingOutlined />} />
          </div>}
          <Icons.image />
          <span className={styles.imgPlaceholder}>{i18nText.addImage}</span>
          <span onMouseDown={handleDeleteImg}>
            <DeleteOutlined color={colors.secondLevelText} className={styles.deleteBtn} />
          </span>
        </div>
      </FilePicker>
  );

  return <div ref={imgWrapRef} className={styles.imagePickerWrap} data-align={originAlign} onMouseDown={handleImgPickerWrapMouseDown}>
    <div contentEditable={false} className={styles.imageContent}>
      {content}
    </div>
    {/* 即使是void类型的元素也一定需要children*/}
    {children}
  </div>;
});

export default Image;
