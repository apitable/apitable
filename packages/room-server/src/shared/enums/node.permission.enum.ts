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

/**
 * <p>
 * Node Permission Enum
 * </p>
 * @author Zoe zheng
 * @date 2020/8/14 5:37 PM
 */
export enum NodePermissionEnum {
  /**
   * manageable
   */
  MANAGEABLE = 'manageable',
  /**
   * editable
   */
  EDITABLE = 'editable',
  /**
   * readable
   */
  READABLE = 'readable',
  /**
   * could create children nodes
   */
  CHILD_CREATABLE = 'childCreatable',
  /**
   * renamable
   */
  RENAMABLE = 'renamable',
  /**
   * icon editable
   */
  ICON_EDITABLE = 'iconEditable',
  /**
   * description editable
   */
  DESCRIPTION_EDITABLE = 'descriptionEditable',
  /**
   * movable
   */
  MOVABLE = 'movable',
  /**
   * reproducible
   */
  COPYABLE = 'copyable',
  /**
   * could be imported
   */
  IMPORTABLE = 'importable',
  /**
   * could be exported
   */
  EXPORTABLE = 'exportable',
  /**
   * removable
   */
  REMOVABLE = 'removable',
  /**
   * shareable
   */
  SHARABLE = 'sharable',
  /**
   * allowed to set node and save it as their own
   */
  ALLOW_SAVE_CONFIGURABLE = 'allowSaveConfigurable',
  /**
   * allowed to set node and edit it
   */
  ALLOW_EDIT_CONFIGURABLE = 'allowEditConfigurable',
  /**
   * allowed to save it as a template
   */
  TEMPLATE_CREATABLE = 'templateCreatable',
  /**
   * allowed to create a view
   */
  VIEW_CREATABLE = 'viewCreatable',
  /**
   * allowed to rename a view
   */
  VIEW_RENAMABLE = 'viewRenamable',
  /**
   * allowed to delete a view
   */
  VIEW_REMOVABLE = 'viewRemovable',
  /**
   * allowed to move a view
   */
  VIEW_MOVABLE = 'viewMovable',
  /**
   * allowed to export a view
   */
  VIEW_EXPORTABLE = 'viewExportable',
  /**
   * allowed to filter a view
   */
  VIEW_FILTERABLE = 'viewFilterable',
  /**
   * allowed to sort the columns
   */
  COLUMN_SORTABLE = 'columnSortable',
  /**
   * allowed to hide the columns
   */
  COLUMN_HIDEABLE = 'columnHideable',
  /**
   * allowed to sort the fields
   */
  FIELD_SORTABLE = 'fieldSortable',
  /**
   * allowed to group the fields
   */
  FIELD_GROUPABLE = 'fieldGroupable',
  /**
   * allowed to edit the height of a row
   */
  ROW_HIGH_EDITABLE = 'rowHighEditable',
  /**
   * allowed to edit the width of a column
   */
  COLUMN_WIDTH_EDITABLE = 'columnWidthEditable',
  /**
   * allowed to edit the type of column statistics
   */
  COLUMN_COUNT_EDITABLE = 'columnCountEditable',
  /**
   * allowed to create a field
   */
  FIELD_CREATABLE = 'fieldCreatable',
  /**
   * allowed to rename a field
   */
  FIELD_RENAMABLE = 'fieldRenamable',
  /**
   * allowed to rename a field
   */
  FIELD_PROPERTY_EDITABLE = 'fieldPropertyEditable',
  /**
   * allowed to delete a field
   */
  FIELD_REMOVABLE = 'fieldRemovable',
  /**
   * allowed to insert a row
   */
  ROW_CREATABLE = 'rowCreatable',
  /**
   * allowed to remove a row
   */
  ROW_REMOVABLE = 'rowRemovable',
  /**
   * allowed to edit a cell
   */
  CELL_EDITABLE = 'cellEditable',
}
