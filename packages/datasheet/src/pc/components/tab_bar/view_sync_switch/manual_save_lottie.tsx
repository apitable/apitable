import { useRef, useEffect } from 'react';
import SyncJson from 'static/json/sync.json';
import lottie from 'lottie-web/build/player/lottie_svg';

const MANUAL_SAVE_SVG_ID = 'MANUAL_SAVE_SVG_ID';
export const ManualSaveLottie = () => {
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
      animationData: SyncJson
    });
  }, [ref]);

  return <div ref={ref} id={MANUAL_SAVE_SVG_ID} style={{ display: 'flex' }} />;
};
