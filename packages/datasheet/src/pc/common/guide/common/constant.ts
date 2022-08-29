
export const MutationObserverConfig = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
};

// slideout
export const GUIDE_SLIDEOUT_Z_INDEX = 1001;

// keycode
export const ESC_KEY_CODE = 27;
export const LEFT_KEY_CODE = 37;
export const RIGHT_KEY_CODE = 39;

// around_mask
export const GUIDE_AROUND_MASK_Z_INDEX = 2000;
export const GUIDE_AROUND_MASK_LEFT_ID = 'GUIDE_AROUND_MASK_LEFT_ID';
export const GUIDE_AROUND_MASK_RIGHT_ID = 'GUIDE_AROUND_MASK_RIGHT_ID';
export const GUIDE_AROUND_MASK_TOP_ID = 'GUIDE_AROUND_MASK_TOP_ID';
export const GUIDE_AROUND_MASK_BOTTOM_ID = 'GUIDE_AROUND_MASK_BOTTOM_ID';

// underlying_mask
export const GUIDE_UNDERLYING_OVERLAY_PADDING = 2;
export const GUIDE_UNDERLYING_OVERLAY_ID = 'GUIDE_UNDERLYING_OVERLAY_ID';
export const GUIDE_UNDERLYING_OVERLAY_Z_INDEX = 2000;
export const GUIDE_UNDERLYING_STAGE_ID = 'GUIDE_UNDERLYING_STAGE_ID';
export const GUIDE_UNDERLYING_STAGE_Z_INDEX = 2001;
export const GUIDE_UNDERLYING_MASK_HIGHLIGHT_DOM_CLASS = 'vika-guide-underlying-mask-highlight-dom';
export const GUIDE_UNDERLYING_MASK_RELATIVE_DOM_CLASS = 'vika-guide-underlying-mask-relative-dom';
export const GUIDE_UNDERLYING_MASK_FIX_STACKING_CONTEXT_CLASS = 'vika-guide-underlying-mask-fix-stacking-context';