import { stopPropagation, showAlert } from '@apitable/components';
import { cellValueToImageSrc, t, Strings, Api, isPrivateDeployment } from '@apitable/core';
import { useMount, useUnmount } from 'ahooks';
import { getAvInfoRequestUrl } from 'pc/utils';
import { useRef } from 'react';
import * as React from 'react';
import Player from 'xgplayer';
import { IPreviewTypeBase } from '../preview_type.interface';
import { IAVInfo, IStream } from './av_info';

const PreviewMedia: React.FC<IPreviewTypeBase> = props => {
  const { file } = props;
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player>();
  const canAutoPlay = useRef<boolean>(true);
  const alertRef = useRef<{ destroy: () => void; }>();

  function closeAutoPlay() {
    return canAutoPlay.current = false;
  }

  const canplay = (mimeType: string, codecs: string[]) => {
    if (mimeType.includes('mp4') && codecs.includes('h264')) {
      return true;
    }
    return false;
  };

  const fetchAvInfo = () => {
    return Api.getAvInfo(getAvInfoRequestUrl(file));
  };

  const createVideoContainer = async() => {

    playerRef.current = new Player({
      el: ref.current!,
      url: cellValueToImageSrc(file),
      height: '100%',
      fitVideoSize: 'fixHeight',
      videoInit: true,
      errorTips: t(Strings.video_not_support_play),
      playsinline: true,
      rotate: {
        innerRotate: true,
      },
      playbackRate: [0.5, 0.75, 1, 1.5, 2, 2.5, 3],
    });

    if (!isPrivateDeployment()) {
      const res = await fetchAvInfo();

      const codecs = (res.data as IAVInfo)
        .streams
        .reduce((prev: string[], cur: IStream) => {
          prev.push(cur.codec_name);
          return prev;
        }, []);

      if (!canplay(file.mimeType, codecs)) {
        alertRef.current = showAlert({
          content: t(Strings.preview_not_support_video_codecs),
          type: 'warning',
          closable: true,
          duration: 0,
        });
        return;
      }
    }

    playerRef.current.play();
    closeAutoPlay();
  };

  useMount(() => {
    createVideoContainer();
  });

  useUnmount(() => {
    playerRef.current?.destroy();
    alertRef.current?.destroy();
  });

  return (
    <div
      ref={ref}
      onMouseDown={stopPropagation}
      style={{
        minWidth: '100%',
      }}
    />
  );
};

export default PreviewMedia;
