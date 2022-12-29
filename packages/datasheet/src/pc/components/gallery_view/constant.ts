import { FieldType } from '@apitable/core';

// The field rendering component declares here the height at which the field will be displayed in the card if it is not a text class.
export const FIELD_HEIGHT_MAP = {
  [FieldType.Attachment]: 24,
  [FieldType.Checkbox]: 16,
  [FieldType.Link]: 25,
  [FieldType.SingleSelect]: 25,
  [FieldType.MultiSelect]: 25,
  // Member
  [FieldType.Member]: 26,
  [FieldType.CreatedBy]: 26,
  [FieldType.LastModifiedBy]: 26,
};

// The height of the field corresponding to the virtual card is calculated
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

  // Member
  [FieldType.Member]: 24,
  [FieldType.CreatedBy]: 24,
  [FieldType.LastModifiedBy]: 24,
};

// Height calculation for fields corresponding to virtual cards on mobile
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
  // Member
  [FieldType.Member]: 27,
  [FieldType.CreatedBy]: 27,
  [FieldType.LastModifiedBy]: 27,
};

// Fields that are not in FIELD_HEIGHT_MAP are displayed as a single line of text height.
export const DEFAULT_SINGLE_TEXT_HEIGHT = 21;

// Thumbnails are displayed when the card is greater than or equal to this width, which is also the fixed card width beyond 1920 px
export const SHOW_THUMBIAL_WIDTH = 336;

export const PADDING_TOP = 32;
export const GROUP_TITLE_DEFAULT_HEIGHT = 14;
export const GROUP_TITLE_RATING_HEIGHT = 18;
export const GROUP_TITLE_CHECKBOX_HEIGHT = 16;
export const GROUP_TITLE_PERSON_HEIGHT = 20;
export const PADDING_RIGHT = 18;
export const PADDING_BOTTOM = 40;
export const ONE_COLUMN_MODE_CONTAINER_WIDTH = 730; // Fixed card width of 720 + 10
export const ItemTypes = {
  CARD: 'card',
};

export enum GalleryGroupItemType {
  // Regular Cards
  Card = 'Card',
  // Add a card
  AddCard = 'AddCard',
  // Blank Card
  BlankCard = 'BlankCard',
  // Subgroup headings
  GroupTitle = 'GroupTitle',
  // Grouping head occupancy gap
  GroupHeadBlank = 'GroupHeadBlank',
}
