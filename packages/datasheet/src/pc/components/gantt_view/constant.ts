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

// Spacing above and below the task
export const GANTT_TASK_GAP_SIZE = 8;

// Height of the vertical bar inside the task drag handle
export const GANTT_INNER_HANDLER_HEIGHT = 12;

// Threshold for Gantt chart to trigger horizontal scrolling
export const GANTT_HORIZONTAL_DEFAULT_SPACING = 50;

// Threshold for Gantt chart to trigger vertical scrolling
export const GANTT_VERTICAL_DEFAULT_SPACING = 50;

// Height of tabbar in Gantt chart graph area
export const GANTT_TAB_BAR_HEIGHT = 40;

// Height of the timeline of the graphical area in the Gantt chart
export const GANTT_TIMELINE_HEIGHT = 32;

// Height of the timeline of the graph area displayed by month in the Gantt chart
export const GANTT_MONTH_TIMELINE_HEIGHT = 40;

// Height of the head of the graphical area in the Gantt chart
export const GANTT_HEADER_HEIGHT = GANTT_TAB_BAR_HEIGHT + GANTT_TIMELINE_HEIGHT;

// Head height by month in Gantt chart
export const GANTT_MONTH_HEADER_HEIGHT = GANTT_TAB_BAR_HEIGHT + GANTT_MONTH_TIMELINE_HEIGHT;

// Height of members in "minimalist" mode in Gantt chart
export const GANTT_SHORT_TASK_MEMBER_ITEM_HEIGHT = 20;

// The size of the icon in the Gantt chart
export const GANTT_COMMON_ICON_SIZE = 16;

export const GANTT_SMALL_ICON_SIZE = 12;

// Inner spacing of exported images
export const EXPORT_IMAGE_PADDING = 16;

// Height of the logo area of the exported image
export const EXPORT_BRAND_DESC_HEIGHT = 48;

// Maximum pixel points in the exported image area
export const MAX_EXPORT_IMAGE_AREA_SIZE = Math.pow(11240, 2);
