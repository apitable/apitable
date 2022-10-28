import { CSSProperties } from 'react';
// import ReactDOM from 'react-dom';
import { GUIDE_AROUND_MASK_LEFT_ID, GUIDE_AROUND_MASK_RIGHT_ID, GUIDE_AROUND_MASK_TOP_ID, 
  GUIDE_AROUND_MASK_BOTTOM_ID, GUIDE_AROUND_MASK_Z_INDEX } from '../common/constant';
import { getCalculatedPosition, bringInView, FocusDom } from '../common/element';
import { stringifyStyleObject } from '../common/utils';

export interface IAroundMaskProps {
  eleString: string
}
const MaskBackground = 'rgba(0,0,0,0.1)';

let curNode: HTMLElement | null = null;
let timer: any;
export const showAroundMask = (props: IAroundMaskProps) => {
  const { eleString } = props;
  let previousNode: HTMLElement | null;
  //   The dom element was found
  const domFound = (targetDom: HTMLElement) => {
    bringInView(targetDom as HTMLElement);
    previousNode = curNode;
    curNode = targetDom;
    if(previousNode === curNode) return;

    const { leftDiv, rightDiv, topDiv, bottomDiv } = getCurMaskDiv();

    if(leftDiv && rightDiv && topDiv && bottomDiv){
      refreshAroundMask(curNode);
      return;
    }
    destroyMask();
    createMask(curNode);
  };
  
  const createMask = (targetDom: HTMLElement) => {
    const { leftStyle, rightStyle, topStyle, bottomStyle } = getAroundDivPositionStyle(targetDom);

    const leftDiv = document.createElement('div');
    const topDiv = document.createElement('div');
    const rightDiv = document.createElement('div');
    const bottomDiv = document.createElement('div');

    leftDiv.setAttribute('id', GUIDE_AROUND_MASK_LEFT_ID);
    topDiv.setAttribute('id', GUIDE_AROUND_MASK_TOP_ID);
    rightDiv.setAttribute('id', GUIDE_AROUND_MASK_RIGHT_ID);
    bottomDiv.setAttribute('id', GUIDE_AROUND_MASK_BOTTOM_ID);

    leftDiv.setAttribute('style', stringifyStyleObject(leftStyle));
    rightDiv.setAttribute('style', stringifyStyleObject(rightStyle));
    topDiv.setAttribute('style', stringifyStyleObject(topStyle));
    bottomDiv.setAttribute('style', stringifyStyleObject(bottomStyle));
    
    document.body.appendChild(leftDiv);
    document.body.appendChild(topDiv);
    document.body.appendChild(rightDiv);
    document.body.appendChild(bottomDiv);
  };

  const destroyMask = () => {
    // Destruction of masks
    const leftDiv = document.getElementById(GUIDE_AROUND_MASK_LEFT_ID);
    const rightDiv = document.getElementById(GUIDE_AROUND_MASK_RIGHT_ID);
    const topDiv = document.getElementById(GUIDE_AROUND_MASK_TOP_ID);
    const bottomDiv = document.getElementById(GUIDE_AROUND_MASK_BOTTOM_ID);
    leftDiv && document.body.removeChild(leftDiv);
    rightDiv && document.body.removeChild(rightDiv);
    topDiv && document.body.removeChild(topDiv);
    bottomDiv && document.body.removeChild(bottomDiv);
  };

  const F = FocusDom({
    element: eleString,
    timer,
    domFound,
  });

  const f = new F();
  f.init();
}; 
const getCurMaskDiv = () => {
  return {
    leftDiv: document.querySelector('#'+ GUIDE_AROUND_MASK_LEFT_ID),
    rightDiv: document.querySelector('#'+ GUIDE_AROUND_MASK_RIGHT_ID),
    topDiv: document.querySelector('#'+ GUIDE_AROUND_MASK_TOP_ID),
    bottomDiv: document.querySelector('#'+ GUIDE_AROUND_MASK_BOTTOM_ID),
  };
};
const getAroundDivPositionStyle = (targetDom: HTMLElement) => {
  const { top, left, right, bottom } = getCalculatedPosition(targetDom);
  const divStyleBase: CSSProperties = { background: MaskBackground, position: 'fixed', zIndex: GUIDE_AROUND_MASK_Z_INDEX, transition: 'all 0.3s' };

  const leftDivStyle: CSSProperties = { width: left + 'px', height: '100%', top: 0, left: 0 };
  const topDivStyle: CSSProperties = { width: `calc(100% - ${left}px)`, height: top + 'px', top: 0, right: 0 };
  const rightDivStyle: CSSProperties = {
    width: `calc(100% - ${right}px)`,
    height: `calc(100% - ${top}px)`,
    top: `${top}px`,
    right: 0,
  };
  const bottomDivStyle: CSSProperties = {
    width: (right - left) + 'px',
    height: `calc(100% - ${bottom}px)`,
    left: `${left}px`,
    bottom: 0,
  };
  return {
    leftStyle: { ...leftDivStyle, ...divStyleBase },
    rightStyle: { ...rightDivStyle, ...divStyleBase },
    topStyle: { ...topDivStyle, ...divStyleBase },
    bottomStyle: { ...bottomDivStyle, ...divStyleBase },
  };
}; 

export const refreshAroundMask = (node?: HTMLElement) => {
  const finalNode = node || curNode;
  if(!finalNode) return;
  const { leftStyle, rightStyle, topStyle, bottomStyle } = getAroundDivPositionStyle(finalNode);
  const { leftDiv, rightDiv, topDiv, bottomDiv } = getCurMaskDiv();
  leftDiv?.setAttribute('style', stringifyStyleObject(leftStyle));
  rightDiv?.setAttribute('style', stringifyStyleObject(rightStyle));
  topDiv?.setAttribute('style', stringifyStyleObject(topStyle));
  bottomDiv?.setAttribute('style', stringifyStyleObject(bottomStyle));
};

export const destroyAroundMask = () => {

  const destroyMask = () => {
    // Destruction of masks
    const leftDiv = document.getElementById(GUIDE_AROUND_MASK_LEFT_ID);
    const rightDiv = document.getElementById(GUIDE_AROUND_MASK_RIGHT_ID);
    const topDiv = document.getElementById(GUIDE_AROUND_MASK_TOP_ID);
    const bottomDiv = document.getElementById(GUIDE_AROUND_MASK_BOTTOM_ID);
    leftDiv && document.body.removeChild(leftDiv);
    rightDiv && document.body.removeChild(rightDiv);
    topDiv && document.body.removeChild(topDiv);
    bottomDiv && document.body.removeChild(bottomDiv);
    curNode=null;
  };
  destroyMask();
};