import { DomEventListener, FocusDom } from '../common/element';
import { IBackdropType } from '../common/interface';
import { destroyAroundMask, showAroundMask } from './around_mask';
import { destroyUnderlyingMask, showUnderlyingMask } from './underlying_mask';

const allClasses = [
  'vika-guide-breath-outset',
  'vika-guide-breath-inset',
  'vika-guide-breath-outset-orange',
  'vika-guide-breath-inset-orange',
];

export interface IGuideBreathOptions {
  element: string;
  shadowDirection?: 'outset' | 'inset' | 'none';
  color?: 'orange';
  onTarget?: () => void;
  backdrop?: IBackdropType;
}

const getBreathClass = (shadowDirection: string, color?: string) => {
  let className = 'vika-guide-breath-' + shadowDirection;
  if (color) className = className + '-' + color;
  return className;
};

let curNode: HTMLElement | null;
let timer: any;
let curOnTarget: (() => void) | undefined;
export const showBreath = (options: IGuideBreathOptions) => {
  const { shadowDirection = 'outset', color, element, onTarget, backdrop } = options;
  let previousNode: HTMLElement | null;

  // 给目标元素添加类
  const add = (targetNode: HTMLElement) => {
    targetNode.classList.add(getBreathClass(shadowDirection, color));
  };

  const remove = (targetNode: HTMLElement) => {
    targetNode.classList.remove(getBreathClass(shadowDirection, color));
  };

  // 找到了dom元素
  const domFound = (targetDom: HTMLElement) => {
    previousNode = curNode;
    curNode = targetDom;
    if (previousNode === curNode) return;
    curOnTarget = onTarget;
    previousNode && remove(previousNode);
    add(curNode);
    if (backdrop && backdrop === 'underlying_mask') {
      showUnderlyingMask({ eleString: element });
    } else if (backdrop && backdrop === 'around_mask') {
      showAroundMask({ eleString: element });
    }
  };

  const Breath = FocusDom({
    element,
    timer,
    domFound,
    onTarget,
  });

  const breath = new Breath();
  breath.init();
};

export const destroyBreath = () => {
  const remove = () => {
    if (curNode) {
      allClasses.forEach(className => {
        curNode!.classList.remove(className);
      });
    }
    destroyUnderlyingMask();
    destroyAroundMask();
    if (curOnTarget) {
      DomEventListener.removeEventListener();
      curOnTarget = undefined;
    }
    curNode = null;
    curOnTarget = undefined;
  };
  remove();
};
