/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { FieldHeadIconType } from './interface';

export const GRID_FIELD_HEAD_HEIGHT = 40; // Height of field header
export const GRID_ROW_HEAD_WIDTH = 70; // Row head width

export const GRID_SCROLL_BASE_SPEED = 15; // Base scroll speed
export const GRID_DEFAULT_VERTICAL_SPACING = 70; // Trigger threshold for vertical scrolling
export const GRID_DEFAULT_HORIZONTAL_SPACING = 70; // Trigger threshold for horizontal scrolling

export const GRID_SCROLL_BAR_OFFSET_X = 50; // Offset of scrollbar

export const GRID_SCROLL_REMAIN_SPACING = 200; // The view has 200px of extra scrolling space

/**
 * Layout
 */
export const GRID_GROUP_OFFSET = 16; // Group Indent
export const GRID_GROUP_STAT_HEIGHT = 48; // Height of Grouping statistics column
export const GRID_BOTTOM_STAT_HEIGHT = 39; // Height of the bottom statistics column
export const GRID_FILL_HANDLER_SIZE = 8; // Width and height of the fill handler
export const GRID_ADD_FIELD_BUTTON_WIDTH = 100; // The width of the column add button when there is no grouping
export const GRID_GROUP_ADD_FIELD_BUTTON_WIDTH = 40; // The width of the column add button when grouping

/**
 * CellValue
 */
export const GRID_ICON_COMMON_SIZE = 16; // Size of common icons
export const GRID_ICON_SMALL_SIZE = 12; // Size of small icons
export const GRID_CELL_VALUE_PADDING = 10; // inner padding of cell
export const GRID_CELL_MULTI_PADDING_TOP = 6; // Vertical inner padding for Member/Option/Link etc. fields
export const GRID_CELL_MULTI_ITEM_MARGIN_TOP = 5; // Vertical margin between Option/Link and other field items
export const GRID_CELL_MULTI_PADDING_LEFT = 4;
export const GRID_CEL_ICON_GAP_SIZE = 8;
export const GRID_CELL_MULTI_ITEM_MARGIN_LEFT = 8; // Horizontal margin between the Member/Option/Link field items
export const GRID_CELL_ADD_ITEM_BUTTON_SIZE = 22; // New button size for Member/Option/Link fields
export const GRID_CELL_DELETE_ITEM_BUTTON_SIZE = 8; // Member/Option/Link etc. field delete button size
export const GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET = 8; // Member/Option/Link fields remove the offset of the button size
export const GRID_CELL_MULTI_ITEM_MIN_WIDTH = 36; // Minimum width of Option/Link etc. field item
export const GRID_CELL_ABBR_MIN_WIDTH = 20; // Minimum width of time zone abbr

// Member
export const GRID_CELL_MEMBER_ITEM_HEIGHT = 24; // Member field item height
export const GRID_CELL_MEMBER_ITEM_PADDING_LEFT = 2; // Member field item left margin
export const GRID_MEMBER_ITEM_PADDING_RIGHT = 8; // Member field item right margin
export const GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT = 8; // Member field item avatar distance from member name
export const GRID_CELL_MEMBER_ITEM_MARGIN_TOP = 3; // Member field item avatar distance from member name

// Option
export const GRID_OPTION_ITEM_PADDING = 10; // Padding for single/multi-select field item
export const GRID_OPTION_ITEM_HEIGHT = 20; // Height for Single/multi-select field item

// Attachment
export const GRID_CELL_ATTACHMENT_PADDING = 10; // Top and bottom padding of attachment field
export const GRID_CELL_ATTACHMENT_ITEM_MARGIN_LEFT = 5; // Horizontal margin of attachment field item

// Link
export const GRID_CELL_LINK_ITEM_PADDING = 10; // Left and right padding of link field item
export const GRID_CELL_LINK_ITEM_HEIGHT = 20; // Height of link field item

// field head icon
export const FIELD_HEAD_TEXT_MIN_WIDTH = 30;
export const FIELD_HEAD_ICON_GAP_SIZE = 4;
export const FIELD_HEAD_ICON_SIZE_MAP = {
  [FieldHeadIconType.Permission]: GRID_ICON_COMMON_SIZE,
  [FieldHeadIconType.Description]: GRID_ICON_SMALL_SIZE,
  [FieldHeadIconType.Error]: GRID_ICON_COMMON_SIZE,
};
