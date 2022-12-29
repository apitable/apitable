export enum ElementType {
  PARAGRAPH = 'paragraph',
  HEADING_ONE = 'headingOne',
  HEADING_TWO = 'headingTwo',
  HEADING_THREE = 'headingThree',
  HEADING_FOUR = 'headingFour',
  HEADING_FIVE = 'headingFive',
  HEADING_SIX = 'headingSix',
  UNORDERED_LIST = 'unorderedList',
  ORDERED_LIST = 'orderedList',
  LIST_ITEM = 'listItem',
  TASK_LIST = 'taskList',
  TASK_LIST_ITEM = 'taskListItem',
  CODE_BLOCK_WRAP = 'codeBlockWrap',
  CODE_BLOCK = 'codeBlock',
  QUOTE = 'quote',
  QUOTE_ITEM = 'quoteItem',
  IMAGE = 'image',
  LINK = 'link',
  MENTION = 'mention',
  DIVIDER = 'divider',
  TABLE_CELL = 'tableCell'
}

// Used to determine if it is a list type
export const LIST_TYPE_DICT = {
  [ElementType.ORDERED_LIST]: ElementType.LIST_ITEM,
  [ElementType.UNORDERED_LIST]: ElementType.LIST_ITEM,
  [ElementType.TASK_LIST]: ElementType.TASK_LIST_ITEM,
  [ElementType.QUOTE]: ElementType.QUOTE_ITEM,
  [ElementType.CODE_BLOCK_WRAP]: ElementType.CODE_BLOCK,
};

export const LIST_ITEM_TYPE_DICT = {
  [ElementType.LIST_ITEM]: ElementType.UNORDERED_LIST,
  [ElementType.TASK_LIST_ITEM]: ElementType.TASK_LIST,
  [ElementType.QUOTE_ITEM]: ElementType.QUOTE,
  [ElementType.CODE_BLOCK]: ElementType.CODE_BLOCK_WRAP,
};

// Used to determine if the current element is a type that can contain other block-level elements
export const IS_WRAP = {
  ...LIST_TYPE_DICT,
};

export const BASIC_ELEMENT = [
  ElementType.PARAGRAPH,
  ElementType.HEADING_ONE,
  ElementType.HEADING_TWO,
  ElementType.HEADING_THREE,
  // ElementType.HEADING_FOUR,
  // ElementType.HEADING_FIVE,
  // ElementType.HEADING_SIX,
];

// Used for toolbar selection to switch the type of elements
export const SELECT_ELEMENT = [
  ...BASIC_ELEMENT,
  ElementType.UNORDERED_LIST,
  ElementType.ORDERED_LIST,
  ElementType.TASK_LIST,
  ElementType.QUOTE,
];

// Types of elements for quick insertion
export const INSERT_PANEL_ELEMENT_FORMAT = [
  ElementType.HEADING_ONE,
  ElementType.HEADING_TWO,
  ElementType.HEADING_THREE,
  ElementType.UNORDERED_LIST,
  ElementType.ORDERED_LIST,
  ElementType.QUOTE,
  ElementType.CODE_BLOCK_WRAP,
  ElementType.TASK_LIST,
  ElementType.DIVIDER,
];
export const INSERT_PANEL_MEDIA_ELEMENT = [
  ElementType.IMAGE,
];

export const DISABLE_TOOLBAR_ELEMENT = {
  [ElementType.CODE_BLOCK]: true,
  [ElementType.CODE_BLOCK_WRAP]: true,
};

export enum MarkType {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underLine',
  STRIKE_THROUGH = 'strikeThrough',
  INLINE_CODE = 'inlineCode',
  HIGHLIGHT = 'highlight',
}

export const HIGHLIGHT_COLORS = {
  select: ['#CEC5FF', '#9CB9FF', '#FFD88A', '#8BDDBE', '#9CE977', '#FFB2C0', '#FFB4AF'],
  show: ['#EDEAFF', '#E0E9FF', '#FFF6E5', '#E2F6EF', '#E3F5DA', '#FFE8EC', '#FBECEB']
};

export const MARK_LIST = Object.values(MarkType).filter(item => item !== MarkType.HIGHLIGHT);

export enum NodeType {
  BLOCK = 'block',
  INLINE = 'inline'
}

export enum ALIGN {
  LEFT = 'alignLeft',
  CENTER = 'alignCenter',
  RIGHT = 'alignRight'
}

export const ALIGN_LIST = Object.values(ALIGN);

export const INDENT_SPACE = 32;

export const MAX_INDENT = 10;

export const Z_INDEX = {
  HOVERING_TOOLBAR: 1060,
  TOOLBAR_SELECT: 1061,
  TOOLBAR_LINK_INPUT: 1061
};

export const IMAGE_MIN_WIDTH = 150;
