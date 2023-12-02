/*
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

package com.apitable.internal.service;

import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.workspace.vo.DatasheetPermissionView;
import java.util.List;
import java.util.function.Consumer;

/**
 * Permission Service.
 */
public interface IPermissionService {

    /**
     * Get data table permission view information.
     *
     * @param userId  user id
     * @param nodeIds node id list
     * @param shareId share id
     * @return DatasheetPermissionViews
     */
    List<DatasheetPermissionView> getDatasheetPermissionView(Long userId, List<String> nodeIds,
                                                             String shareId);

    /**
     * check member permission.
     *
     * @param resourceId resource id
     * @param permission node permission
     * @param shareId    share id
     */
    void checkPermissionBySessionOrShare(String resourceId, String shareId,
                                         NodePermission permission, Consumer<Boolean> consumer);
}
