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

package com.apitable.workspace.service;

import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.workspace.entity.NodeShareSettingEntity;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * share setting class.
 */
public interface INodeShareSettingService extends IService<NodeShareSettingEntity> {

    /**
     * get space id.
     *
     * @param shareId share id
     * @return spaceId
     */
    String getSpaceId(String shareId);

    /**
     * get updated by share id.
     *
     * @param shareId shareId
     * @return the user id of the last editor
     */
    Long getUpdatedByByShareId(String shareId);

    /**
     * get share permission.
     *
     * @param shareId share id
     * @return NodePermission
     */
    NodePermission getPermissionByShareId(String shareId);
}
