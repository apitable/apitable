import { useState, useEffect } from 'react';
import { imageCache } from 'pc/components/konva_grid';

export interface IUseImageProps {
  url: string;
  crossOrigin?: string;
}

export interface IUseImageResults {
  image?: HTMLImageElement;
  width: number;
  height: number;
  status: string;
}

export const useImage = ({ url, crossOrigin }: IUseImageProps) => {
  const [state, setState] = useState<IUseImageResults>(() => ({
    image: undefined,
    status: 'loading',
    width: 0,
    height: 0,
  }));

  useEffect(() => {
    if (!url) return;

    // 缓存中加载过，就直接从缓存中读取
    let img = imageCache.getImage(url);
    if (img) {
      return setState({
        image: img,
        height: img.height,
        width: img.width,
        status: 'loaded',
      });
    }

    img = new Image();

    function onload() {
      setState({
        image: img,
        height: img.height,
        width: img.width,
        status: 'loaded',
      });
    }
    function onerror() {
      setState((prev) => ({
        ...prev,
        image: undefined,
        status: 'failed',
      }));
    }
    img.addEventListener('load', onload);
    img.addEventListener('error', onerror);

    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;

    return () => {
      img.removeEventListener('load', onload);
      img.removeEventListener('error', onerror);
    };
  }, [url, crossOrigin]);

  return state;
};
