import { useRef, useEffect } from 'react';
import AutoSaveJson from 'static/json/autosave.json';
import lottie from 'lottie-web/build/player/lottie_svg';
import { Events, Player } from '@vikadata/core';

const AUTO_SAVE_SVG_ID = 'AUTO_SAVE_SVG_ID';
export const AutoSaveLottie = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: AutoSaveJson
    });
    Player.doTrigger(Events.view_notice_auto_save_true);
  }, [ref]);

  return <div ref={ref} id={AUTO_SAVE_SVG_ID} style={{ display: 'flex' }} />;
};
