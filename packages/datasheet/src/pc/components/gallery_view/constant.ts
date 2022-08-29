import { FieldType } from '@vikadata/core';

// 字段渲染组件如果不是 text 类，在这里声明字段在卡片中的展示高度。
export const FIELD_HEIGHT_MAP = {
  [FieldType.Attachment]: 24,
  [FieldType.Checkbox]: 16,
  [FieldType.Link]: 25,
  [FieldType.SingleSelect]: 25,
  [FieldType.MultiSelect]: 25,
  // 成员
  [FieldType.Member]: 26,
  [FieldType.CreatedBy]: 26,
  [FieldType.LastModifiedBy]: 26,
};

// 虚拟卡片对应的字段计算高度
export const FIELD_HEIGHT_VIRTUAL_MAP = {
  [FieldType.Rating]: 16,
  [FieldType.Checkbox]: 16,
  [FieldType.SingleSelect]: 20,
  [FieldType.MultiSelect]: 21,
  [FieldType.SingleText]: 21,
  [FieldType.Attachment]: 24,
  [FieldType.Formula]: 21,
  [FieldType.Number]: 21,
  [FieldType.Currency]: 21,
  [FieldType.Percent]: 21,
  [FieldType.DateTime]: 21,
  [FieldType.Link]: 20,

  // 成员
  [FieldType.Member]: 24,
  [FieldType.CreatedBy]: 24,
  [FieldType.LastModifiedBy]: 24,
};

// 移动端虚拟卡片对应的字段计算高度
export const FIELD_HEIGHT_VIRTUAL_MAP_MOBILE = {
  ...FIELD_HEIGHT_VIRTUAL_MAP,

  [FieldType.SingleSelect]: 24,
  [FieldType.MultiSelect]: 24,
  [FieldType.Link]: 23,
};

export const FIELD_HEIGHT_MAP_MOBILE = {
  [FieldType.Attachment]: 24,
  [FieldType.Checkbox]: 16,
  [FieldType.Link]: 29,
  [FieldType.SingleSelect]: 29,
  [FieldType.MultiSelect]: 29,
  // 成员
  [FieldType.Member]: 27,
  [FieldType.CreatedBy]: 27,
  [FieldType.LastModifiedBy]: 27,
};

// 不在 FIELD_HEIGHT_MAP 中的字段，都是以单行文本高度展示。
export const DEFAULT_SINGLE_TEXT_HEIGHT = 21;

export const ADD_NEW_RECORD = 'ADD_NEW_RECORD';

// 卡片大于等于这个宽度的时候显示缩略图，同时这个宽度也是超过 1920 px 后的固定卡片宽度
export const SHOW_THUMBIAL_WIDTH = 336;

export enum CardType {
  Blank = 'blank',
  Add = 'add',
  Title = 'title',
  Default = 'default'
}

export const PADDING_TOP = 32;
export const GROUP_TITLE_CARD_HEIGHT = 38;
export const GROUP_TITLE_DEFAULT_HEIGHT = 14;
export const GROUP_TITLE_RATING_HEIGHT = 18;
export const GROUP_TITLE_CHECKBOX_HEIGHT = 16;
export const GROUP_TITLE_SELECT_LINK_HEIGHT = 20;
export const GROUP_TITLE_PERSON_HEIGHT = 20;
export const PADDING_RIGHT = 18;
export const PADDING_BOTTOM = 40;
export const ONE_COLUMN_MODE_CONTAINER_WIDTH = 730; // 720 的固定卡片宽度 + 10
export const ItemTypes = {
  CARD: 'card',
};

export enum GalleryGroupItemType {
  // 普通卡片
  Card = 'Card',
  // 添加卡片
  AddCard = 'AddCard',
  // 空白卡片
  BlankCard = 'BlankCard',
  // 分组头标题
  GroupTitle = 'GroupTitle',
  // 分组头占位空白
  GroupHeadBlank = 'GroupHeadBlank',
}