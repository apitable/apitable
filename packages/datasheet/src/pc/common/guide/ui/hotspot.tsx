import AnimationJson from 'static/json/motion_dot_transparent.json';

export interface IHotspotProps {
  eleString: string;
  placement?: IPlacement;
  container?: HTMLElement;
}

type IPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';
let timer: any;
const HOTSPOT_ZINDEX = 1222;
export const showHotspot = (options: IHotspotProps) => {
  const { eleString, placement = 'bottom' } = options;
  // 创建外层wrap
  const attach = (style: string) => {
    const HotspotWrap = document.createElement('div');
    HotspotWrap.setAttribute('id', 'HOTSPOT_ID');
    HotspotWrap.setAttribute('style', style);
    document.body.appendChild(HotspotWrap);
  };

  // 定位圆点外层div样式（包括位置）
  const getDotWrapStyle = (targetDom: Element, placement: IPlacement) => {
    const rect = targetDom.getBoundingClientRect();
    const eleWidth = Math.min(rect.right - rect.left, 50);
    const eleHeight = Math.min(rect.bottom - rect.top, 50);
    // eslint-disable-next-line
    const styleBase = `width: ${eleWidth}px; height: ${eleHeight}px; position: fixed; z-index: ${HOTSPOT_ZINDEX}; cursor: pointer;`;

    let dotTop = rect.top + rect.height / 2 - eleHeight / 2;
    let dotLeft = rect.left + rect.width / 2 - eleWidth / 2;

    if (placement.indexOf('top') >= 0 || placement.indexOf('Top') >= 0) {
      dotTop = rect.top;
    } else if (placement.indexOf('bottom') >= 0 || placement.indexOf('Bottom') >= 0) {
      dotTop = rect.bottom - eleHeight;
    }
    if (placement.indexOf('left') >= 0 || placement.indexOf('Left') >= 0) {
      dotLeft = rect.left;
    } else if (placement.indexOf('right') >= 0 || placement.indexOf('Right') >= 0) {
      dotLeft = rect.right - eleWidth;
    }

    return `${styleBase} top: ${dotTop}px; left: ${dotLeft}px;`;
  };

  const destroy = () => {
    const hotpotDot = document.getElementById('HOTSPOT_ID');
    if (hotpotDot) {
      document.body.removeChild(hotpotDot);
    }
    if (timer) {
      clearInterval(timer);
    }
  };

  // 找到了dom元素
  const domFound = (targetDom: HTMLElement) => {
    attach(getDotWrapStyle(targetDom, placement));
    import('lottie-web/build/player/lottie_svg').then(module => {
      const lottie = module.default;
      lottie.loadAnimation({
        container: document.querySelector('#' + 'HOTSPOT_ID')!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: AnimationJson,
      });
    });
  };

  // 寻找目标元素
  const startFind = () => {
    destroy();
    timer = window.setInterval(() => {
      const targetDom = document.querySelector(eleString);
      if (targetDom) {
        clearInterval(timer);
        timer = null;
        domFound(targetDom as HTMLElement);
      }
    }, 300);
  };

  startFind();
};
