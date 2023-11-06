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

package com.apitable.space.service;


import com.apitable.space.entity.SpaceRoleResourceRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * space role resource rel service.
 */
public interface ISpaceRoleResourceRelService extends IService<SpaceRoleResourceRelEntity> {

    /**
     * space roles are associated with permissions.
     *
     * @param roleCodes     roleCodes
     * @param resourceCodes resourceCodes
     */
    void createBatch(List<String> roleCodes, List<String> resourceCodes);

    /**
     * delete space role.
     *
     * @param roleCode roleCode
     */
    void delete(String roleCode);

    /**
     * delete space role's permission.
     *
     * @param roleCode      roleCode
     * @param resourceCodes resourceCodes
     */
    void deleteBatch(String roleCode, List<String> resourceCodes);

    /**
     * get resource codes by role code.
     *
     * @param roleCode role code
     * @return resource codes
     */
    List<String> getResourceCodesByRoleCode(String roleCode);
}
