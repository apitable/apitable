import { colors } from '@vikadata/components';
import { IReduxState, IUserInfo } from '@apitable/core';
import Konva from 'konva';
import { debounce } from 'lodash';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface IWatermarkSettings {
  watermark_id: string; //水印总体的id
  watermark_prefix: string; //小水印的id前缀
  watermark_txt: string; //水印的内容
  watermark_x: number; //水印起始位置x轴坐标
  watermark_x_gap: number; //水印x轴间隔
  watermark_y_gap: number; //水印y轴间隔
  watermark_color: string; //水印字体颜色
  watermark_fontsize: number; //水印字体大小
  watermark_opacity: number; //水印透明度，要求设置在大于等于0.005
  watermark_rotate: number; //水印倾斜度数
  watermark_parent_width: number; //水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
  watermark_parent_height: number; //水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
  watermark_parent_node: null | string; //水印插件挂载的父元素element,不输入则默认挂在body上
  watermark_z_index: number; // 水印的z-index值
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
  // 加载水印
  const loadMark = useRefCallback((propsSettings?: IWatermarkSettings) => {
    const settings = propsSettings || globalSetting;
    if (!settings.watermark_txt) {
      console.warn('! ' + 'watermark_txt is null');
      return;
    }
    /*如果元素存在则移除*/
    const watermarkElement = document.getElementById(settings.watermark_id);
    watermarkElement && watermarkElement.parentNode && watermarkElement.parentNode.removeChild(watermarkElement);
    /*如果设置水印挂载的父元素的id*/
    const parentEle = (settings.watermark_parent_node && document.querySelector(settings.watermark_parent_node)) || document.body;
    /*获取父元素的宽高*/
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

  // 移除水印
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

// 获取水印内容 - 空间昵称+手机尾号四位 > 空间昵称+邮箱前缀 > 空间昵称 （不限制长度）
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
