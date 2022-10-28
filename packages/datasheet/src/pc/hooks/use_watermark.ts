import { colors } from '@vikadata/components';
import { IReduxState, IUserInfo } from '@apitable/core';
import Konva from 'konva';
import { debounce } from 'lodash';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface IWatermarkSettings {
  watermark_id: string; 
  watermark_prefix: string; 
  watermark_txt: string; 
  watermark_x: number; 
  watermark_x_gap: number; 
  watermark_y_gap: number; 
  watermark_color: string; 
  watermark_fontsize: number;
  watermark_opacity: number; 
  watermark_rotate: number;
  watermark_parent_width: number; // Overall width of the watermark (default: the greater of the body's scrollWidth and clientWidth)
  watermark_parent_height: number; // Overall height of the watermark (default: the greater of the body's scrollHeight and clientHeight)
  watermark_parent_node: null | string; 
  watermark_z_index: number; 
  manual: boolean;
}

const defaultSettings: IWatermarkSettings = {
  watermark_id: 'wm_div_id',
  watermark_prefix: 'maskDiv_id',
  watermark_txt: '维格星球',
  watermark_x: 55,
  watermark_x_gap: 80,
  watermark_y_gap: 80,
  watermark_color: colors.thirdLevelText,
  watermark_fontsize: 12,
  watermark_opacity: 0.1,
  watermark_rotate: -15,
  watermark_parent_width: 0,
  watermark_parent_height: 0,
  watermark_parent_node: null,
  watermark_z_index: 99999,
  manual: false,
};

let seed = 0;
const now = Date.now();

const getUuid = () => {
  const id = seed;
  seed += 1;
  return `wm_id_${now}_${id}`;
};
const MutationObserverOption = {
  childList: true,
  attributes: true,
  subtree: true,
};

export function useRefCallback<T extends(...args: any[]) => any>(callback: T) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}

export const getWatermarkText = (user: IUserInfo) => {
  const { memberName, mobile, email } = user;
  if (mobile || email) {
    const mobileOrMailText = mobile ? String(mobile).substring(String(mobile).length - 4) : email.substring(0, email.indexOf('@'));
    return `${memberName} ${mobileOrMailText}`;
  }
  return memberName;
};

export const useWatermark = (props?: Partial<IWatermarkSettings>) => {
  const resizeLoadMark = useRef<any>();
  const timer = useRef<any>();
  const [globalSetting, setGlobalSetting] = useState(defaultSettings);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEffect(() => {
    if (!props) return;
    const newSettings = { ...defaultSettings, watermark_id: props && props.watermark_id ? props.watermark_id : getUuid() };
    Object.keys(props).forEach(key => {
      if (key === 'watermark_id') return;
      if (newSettings.hasOwnProperty(key) && newSettings[key] !== props[key]) {
        newSettings[key] = props[key];
      }
    });
  }, [props]);
  const domChangeCallback = useRefCallback(() => {
    loadMark(globalSetting);
  });
  const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver || (window as any).MozMutationObserver;
  const hasObserver = MutationObserver !== undefined;
  const watermarkDom = hasObserver ? new MutationObserver(domChangeCallback) : null;
  // Load watermark
  const loadMark = useRefCallback((propsSettings?: IWatermarkSettings) => {
    const settings = propsSettings || globalSetting;
    if (!settings.watermark_txt) {
      console.warn('! ' + 'watermark_txt is null');
      return;
    }
    /*Remove if element exists*/
    const watermarkElement = document.getElementById(settings.watermark_id);
    watermarkElement && watermarkElement.parentNode && watermarkElement.parentNode.removeChild(watermarkElement);
    /*If the id of the parent element to which the watermark is mounted is set*/
    const parentEle = (settings.watermark_parent_node && document.querySelector(settings.watermark_parent_node)) || document.body;
    /*Get the width and height of the parent element*/
    const parentWidth = Math.max(parentEle.scrollWidth, parentEle.clientWidth);
    const parentHeight = Math.max(parentEle.scrollHeight, parentEle.clientHeight);

    if (isMobile) {
      settings.watermark_x = 0;
    }
    const wrapDom = document.createElement('div');
    wrapDom.id = settings.watermark_id;
    wrapDom.setAttribute(
      'style',
      `pointer-events: none !important; display: block !important; position: absolute; left:0; top: 0;z-index:${settings.watermark_z_index}`,
    );
    parentEle.appendChild(wrapDom);

    const stage = new Konva.Stage({
      container: settings.watermark_id,
      width: parentWidth,
      height: parentHeight,
    });
    const layer = new Konva.Layer({ listening: false });
    stage.add(layer);

    const textDom = new Konva.Text({
      text: settings.watermark_txt,
      fontSize: settings.watermark_fontsize,
    });

    textDom.rotate(settings.watermark_rotate);
    const textDomWidth = textDom.getClientRect().width;
    const textDomHeight = textDom.getClientRect().height;
    const textDomAlignX = Math.ceil(Math.abs(textDom.getClientRect().x));
    const textDomAlignY = Math.ceil(Math.abs(textDom.getClientRect().y));
    const countX = Math.ceil(parentWidth / (textDomWidth + settings.watermark_x_gap));
    const countY = Math.ceil(parentHeight / (textDomHeight + settings.watermark_y_gap));

    const initX = settings.watermark_x + textDomAlignX;
    let x = initX;
    let y = textDomAlignY;
    for (let i = 0; i < countY; i++) {
      if (i % 2 !== 0) {
        x = x + textDomWidth;
      }
      for (let j = 0; j < countX; j++) {
        const newText = new Konva.Text({
          x,
          y,
          text: settings.watermark_txt,
          fontSize: settings.watermark_fontsize,
          fill: settings.watermark_color,
          opacity: settings.watermark_opacity,
        });
        newText.rotate(settings.watermark_rotate);
        layer.add(newText);
        x = x + textDomWidth + settings.watermark_x_gap;
      }
      x = initX;
      y = y + textDomHeight + settings.watermark_y_gap;
    }
    layer.draw();
    if (hasObserver && watermarkDom) {
      watermarkDom.observe(wrapDom, MutationObserverOption);
    }
  });

  const initWM = useRefCallback((settings?: Partial<IWatermarkSettings>) => {
    const newSettings = { ...globalSetting, watermark_id: settings && settings.watermark_id ? settings.watermark_id : getUuid() };
    settings &&
      Object.keys(settings).forEach(key => {
        if (key === 'watermark_id') return;
        if (newSettings.hasOwnProperty(key) && newSettings[key] !== settings[key]) {
          newSettings[key] = settings[key];
        }
      });
    setGlobalSetting(newSettings);
    resizeLoadMark.current = debounce(() => {
      loadMark(newSettings);
    }, 500);
    resizeLoadMark.current();
    window.addEventListener('resize', resizeLoadMark.current);
    timer.current = window.setInterval(() => {
      const wmDom = document.getElementById(newSettings.watermark_id);
      if (!wmDom) {
        loadMark(newSettings);
      }
    }, 500);
  });

  // Remove watermark
  const removeWM = useRefCallback((settings?: Partial<IWatermarkSettings>) => {
    watermarkDom?.disconnect();
    const id = settings?.watermark_id || globalSetting.watermark_id;
    const watermarkElement = document.getElementById(id);
    if (watermarkElement) {
      const _parentElement = watermarkElement.parentNode;
      _parentElement && _parentElement.removeChild(watermarkElement);
    }
    window.removeEventListener('resize', resizeLoadMark.current);
    resizeLoadMark.current = null;
    window.clearInterval(timer.current);
    timer.current = null;
  });

  useEffect(() => {
    const run = !props || !props.manual;
    run && initWM(props);
    return () => {
      run && removeWM();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { initWM, removeWM };
};

// Get Watermark Content - Space Nickname + Mobile Phone Last Number 4 digits > Space Nickname + Email Prefix > Space Nickname (unlimited length)
export const useWatermarkText = () => {
  const user = useSelector((state: IReduxState) => state.user.info);
  if (!user) return;
  return getWatermarkText(user);
};

export const useSpaceWatermark = (props?: Partial<IWatermarkSettings>) => {
  const txt = useWatermarkText();
  const id = 'VIKA_WATER_MARK_ID';
  const initSetting = props
    ? {
      ...props,
      watermark_txt: props?.watermark_txt || txt,
      watermark_id: props?.watermark_id || id,
    }
    : undefined;

  const { initWM: initWM, removeWM } = useWatermark(initSetting ? { ...initSetting, manual: true } : { manual: true });

  const initSpaceWM = useRefCallback((settings?: Partial<IWatermarkSettings>) => {
    initWM(settings ? { ...settings, watermark_txt: settings?.watermark_txt || txt } : initSetting);
  });
  const removeSpaceWM = useRefCallback((props?: Partial<IWatermarkSettings>) => {
    removeWM({ watermark_id: props?.watermark_id || id });
  });

  useEffect(() => {
    const run = !props || !props.manual;
    run && initSpaceWM({ ...props, watermark_txt: props?.watermark_txt || txt });
    return () => {
      run && removeSpaceWM();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { initSpaceWM, removeSpaceWM };
};
