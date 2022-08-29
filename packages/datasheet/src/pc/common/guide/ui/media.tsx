import { t, Strings } from '@vikadata/core';
import { useMount, useUpdateEffect, useUnmount } from 'ahooks';
import { useRef, useEffect } from 'react';
import * as React from 'react';
import Player from 'xgplayer';

interface IPreviewTypeBase {
  video: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  id?: string;
  poster?: string;
}
const PreviewMedia: React.FC<IPreviewTypeBase> = props => {
  const { autoPlay, video, onPlay, id, poster } = props;
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player>();
  const canAutoPlay = useRef<boolean>(true);

  function closeAutoPlay() {
    return canAutoPlay.current = false;
  }

  useMount(() => {
    playerRef.current = new Player({
      closeVideoStopPropagation: false,
      el: ref.current!,
      fluid: true,
      url: `${video}`,
      videoInit: true,
      errorTips: t(Strings.video_not_support_play),
      playsinline: true,
      poster,
    });

    if (autoPlay) {
      playerRef.current.play();
      onPlay && onPlay();
      closeAutoPlay();
    }

  });
  useEffect(()=>{
    const onMouseup = () => {
      setTimeout(() => {
        playerRef.current!.hasStart && onPlay && onPlay();
      }, 200);
    };
    const dom = ref.current;
    dom?.addEventListener('mouseup', onMouseup);
    return () =>{
      dom?.removeEventListener('mouseup', onMouseup);
    };
  }, [onPlay]);
  useUnmount(() => {
    playerRef.current?.destroy();
  });

  useUpdateEffect(() => {
    if (!playerRef.current) { return; }

    if (!autoPlay) {
      return playerRef.current.pause();
    }

    if (canAutoPlay.current && autoPlay) {
      playerRef.current.play();
      onPlay && onPlay();
      closeAutoPlay();
    }
  }, [autoPlay]);

  return (
    <div ref={ref} id={id}/>
  );
};

export default PreviewMedia;
