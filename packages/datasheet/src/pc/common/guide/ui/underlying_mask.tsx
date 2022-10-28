import {
  GUIDE_UNDERLYING_MASK_FIX_STACKING_CONTEXT_CLASS, GUIDE_UNDERLYING_MASK_HIGHLIGHT_DOM_CLASS, GUIDE_UNDERLYING_MASK_RELATIVE_DOM_CLASS,
  GUIDE_UNDERLYING_OVERLAY_ID, GUIDE_UNDERLYING_OVERLAY_PADDING, GUIDE_UNDERLYING_OVERLAY_Z_INDEX, GUIDE_UNDERLYING_STAGE_ID,
  GUIDE_UNDERLYING_STAGE_Z_INDEX
} from '../common/constant';
import { bringInView, canMakeRelative, FocusDom, getCalculatedPosition, getStyleProperty } from '../common/element';
import { stringifyStyleObject } from '../common/utils';

export interface IUnderlyingMaskProps {
  eleString: string;
}

const MaskBackground = 'rgba(0,0,0,0.1)';
let curNode: HTMLElement | null = null;
let timer: any;

export const showUnderlyingMask = (props: IUnderlyingMaskProps) => {
  const { eleString } = props;
  let previousNode: HTMLElement | null;
  // Create overlay
  const attachOverlay = () => {
    const pageOverlay = document.getElementById(GUIDE_UNDERLYING_OVERLAY_ID);
    if (pageOverlay) return;
    const overlay = document.createElement('div');
    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: GUIDE_UNDERLYING_OVERLAY_Z_INDEX,
      background: MaskBackground,
    };
    overlay.setAttribute('id', GUIDE_UNDERLYING_OVERLAY_ID);
    overlay.setAttribute('style', stringifyStyleObject(overlayStyle));
    document.body.appendChild(overlay);
  };

  // Create a stage
  const attachStage = (targetDom: HTMLElement) => {
    const pageOverlay = document.getElementById(GUIDE_UNDERLYING_STAGE_ID);
    if (pageOverlay) return;

    const overlay = document.createElement('div');
    const stageStyle = calculateStageStyle(targetDom);
    overlay.setAttribute('id', GUIDE_UNDERLYING_STAGE_ID);
    overlay.setAttribute('style', stringifyStyleObject(stageStyle));
    document.body.appendChild(overlay);
  };

  // Calculate the style of the stage
  const calculateStageStyle = (targetDom: HTMLElement) => {
    const { left, right, top, bottom } = getCalculatedPosition(targetDom);
    const padding = GUIDE_UNDERLYING_OVERLAY_PADDING;

    const width = (right - left) + (padding * 2);
    const height = (bottom - top) + (padding * 2);
    const stageStyle: React.CSSProperties = {
      display: 'block',
      width: `${width}px`,
      height: `${height}px`,
      position: 'absolute',
      top: `${top - padding}px`,
      left: `${left - padding}px`,
      zIndex: GUIDE_UNDERLYING_STAGE_Z_INDEX,
      background: '#fff',
      transition: 'all 0.3s',
    };
    return stageStyle;
  };

  // Remove dom's associated highlighting style
  const removeHighlightClasses = (node: HTMLElement | null) => {
    if (node) {
      node.classList.remove(GUIDE_UNDERLYING_MASK_HIGHLIGHT_DOM_CLASS);
    }
  };
  // Add dom related highlighting styles
  const addHighlightClasses = (node: HTMLElement) => {
    node.classList.add(GUIDE_UNDERLYING_MASK_HIGHLIGHT_DOM_CLASS);
    canMakeRelative(node) && node.classList.add(GUIDE_UNDERLYING_MASK_RELATIVE_DOM_CLASS);
  };

  // Get the dom element: stage
  const getStageDiv = () => {
    return document.getElementById(GUIDE_UNDERLYING_STAGE_ID);
  };

  const fixStackingContext = (node: HTMLElement) => {
    let parentNode = node.parentNode;
    while (parentNode) {
      if (!(parentNode as Element).tagName || (parentNode as Element).tagName.toLowerCase() === 'body') {
        break;
      }

      const zIndex = getStyleProperty(parentNode, 'z-index');
      const opacity = parseFloat(getStyleProperty(parentNode, 'opacity'));
      const transform = getStyleProperty(parentNode, 'transform', true);
      const transformStyle = getStyleProperty(parentNode, 'transform-style', true);
      const transformBox = getStyleProperty(parentNode, 'transform-box', true);
      const filter = getStyleProperty(parentNode, 'filter', true);
      const perspective = getStyleProperty(parentNode, 'perspective', true);

      if (
        /[0-9]+/.test(zIndex)
        || opacity < 1
        || (transform && transform !== 'none')
        || (transformStyle && transformStyle !== 'flat')
        || (transformBox && transformBox !== 'border-box')
        || (filter && filter !== 'none')
        || (perspective && perspective !== 'none')
      ) {
        (parentNode as Element).classList.add(GUIDE_UNDERLYING_MASK_FIX_STACKING_CONTEXT_CLASS);
      }

      parentNode = parentNode.parentNode;
    }
  };
  // Update the stage element
  const refreshStage = (previousNode: HTMLElement | null, curNode: HTMLElement) => {
    const stageDiv = getStageDiv();
    const newStageStyle = calculateStageStyle(curNode);
    removeHighlightClasses(previousNode);
    stageDiv?.setAttribute('style', stringifyStyleObject(newStageStyle));
    addHighlightClasses(curNode);
  };
  // Target element found
  const domFound = (targetDom: HTMLElement) => {
    bringInView(targetDom as HTMLElement);
    previousNode = curNode;
    curNode = targetDom;
    if (previousNode === curNode) return;

    const stageDiv = getStageDiv();
    if (stageDiv) {
      fixStackingContext(curNode);
      refreshStage(previousNode, curNode);
      return;
    }
    fixStackingContext(curNode);
    addHighlightClasses(curNode);
    attachStage(curNode);
    attachOverlay();

  };

  const F = FocusDom({
    element: eleString,
    timer,
    domFound,
  });

  const f = new F();
  f.init();
};

export const destroyUnderlyingMask = () => {
  const removeHighlightClasses = (node: HTMLElement | null) => {
    if (node) {
      node.classList.remove(GUIDE_UNDERLYING_MASK_HIGHLIGHT_DOM_CLASS);
    }
  };

  const destroy = () => {
    removeHighlightClasses(curNode);
  };
  destroy();

};
