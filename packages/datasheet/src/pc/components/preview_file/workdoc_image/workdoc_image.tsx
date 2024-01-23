import FileSaver from 'file-saver';
import * as React from 'react';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ITransFormInfo } from 'pc/components/preview_file/preview_file.interface';
import {
  initTransformInfo,
  initTranslatePosition,
  MAX_SCALE,
  MIN_SCALE
} from 'pc/components/preview_file/preview_main/constant';
import { getFile } from 'pc/components/preview_file/preview_main/util';
import useFrameSetState from 'pc/components/preview_file/preview_type/preview_image/hooks/use_frame_state';
import { PreviewImage } from 'pc/components/preview_file/preview_type/preview_image/preview_image';
import { ToolBar } from 'pc/components/preview_file/tool_bar';
import styles from './style.module.less';

interface IWorkdocImage {
  onClose: () => void;
  file: any;
  onDelete: () => void;
}

export const WorkdocImage = ({ onClose, file, onDelete }: IWorkdocImage) => {
  const [transformInfo, setTransformInfo] = useFrameSetState<ITransFormInfo>(initTransformInfo);
  const onZoom = useCallback(
    (newScale: number) => {
      const { initActualScale } = transformInfo;

      const minTransformScale = MIN_SCALE / initActualScale;
      const maxTransformScale = MAX_SCALE / initActualScale;

      setTransformInfo((state) => {
        if (newScale <= minTransformScale) {
          return {
            ...state,
            scale: minTransformScale,
            translatePosition: initTranslatePosition,
          };
        }

        if (newScale >= maxTransformScale) {
          return {
            ...state,
            scale: maxTransformScale,
            translatePosition: initTranslatePosition,
          };
        }
        return {
          ...state,
          scale: newScale,
          translatePosition: initTranslatePosition,
        };
      });
    },
    [setTransformInfo, transformInfo],
  );
  const onRotate = useCallback(() => {
    setTransformInfo((state) => {
      const rotate = state.rotate || 0;
      return {
        ...state,
        rotate: rotate + 90,
        translatePosition: initTranslatePosition,
      };
    });
  }, [setTransformInfo]);

  const parent = document.getElementById('workdocImage');

  if (!parent) {
    return null;
  }

  return createPortal((
    <div className={styles.workdocImage} onClick={e => {
      e.stopPropagation();
      e.preventDefault();
    }}>
      <div className={styles.header}>
        <ToolBar
          transformInfo={transformInfo}
          setTransformInfo={setTransformInfo}
          fileInfo={file}
          onClose={onClose}
          onDelete={onDelete}
          onDownload={async () => {
            const blob = await getFile(file.token);
            FileSaver.saveAs(blob, file.name);
          }}
          readonly={false}
          onRotate={onRotate}
          previewEnable
          isDocType={false}
          officePreviewUrl={''}
          onZoom={onZoom}
          disabledDownload={false}
          isFullScreen={false}
        />
      </div>
      <div className={styles.container}>
        <PreviewImage
          transformInfo={transformInfo}
          setTransformInfo={setTransformInfo}
          file={file}
          disabledDownload={false}
        />
      </div>
    </div>
  ), parent);
};