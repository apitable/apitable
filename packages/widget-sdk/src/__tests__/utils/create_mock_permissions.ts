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

import { IPermissions } from 'core';

export function createMockPermissions(): IPermissions {
  return {
    allowEditConfigurable: true,
    allowSaveConfigurable: true,
    childCreatable: true,
    copyable: true,
    descriptionEditable: true,
    editable: true,
    exportable: true,
    iconEditable: true,
    importable: true,
    manageable: true,
    movable: true,
    nodeAssignable: true,
    readable: true,
    removable: true,
    renamable: true,
    sharable: true,
    templateCreatable: true,
    viewCreatable: true,
    viewRenamable: true,
    viewRemovable: true,
    viewMovable: true,
    viewExportable: true,
    viewFilterable: true,
    columnSortable: true,
    columnHideable: true,
    fieldSortable: true,
    fieldGroupable: true,
    rowHighEditable: true,
    columnWidthEditable: true,
    columnCountEditable: true,
    rowSortable: true,
    fieldCreatable: true,
    fieldRenamable: true,
    fieldPropertyEditable: true,
    fieldRemovable: true,
    rowCreatable: true,
    rowRemovable: true,
    cellEditable: true,
    fieldPermissionManageable: true,
    viewLayoutEditable: true,
    viewStyleEditable: true,
    viewKeyFieldEditable: true,
    viewColorOptionEditable: true,
    viewManualSaveManageable: true,
    viewOptionSaveEditable: true
  };
}
