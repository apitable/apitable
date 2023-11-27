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

package com.apitable.control.infrastructure.role;

import com.apitable.control.infrastructure.permission.PermissionDefinition;
import com.apitable.space.vo.SpaceGlobalFeature;
import java.util.Map;
import java.util.Set;

/**
 * role attribute interface.
 *
 * @author Shawn Deng
 */
public interface ControlRole extends RoleComparable<ControlRole> {

    /**
     * Whether it is possible to set assignment to organizational unit.
     *
     * @return false | true
     */
    default boolean canAssignable() {
        return true;
    }

    /**
     * is it an administrator.
     *
     * @return false | true
     */
    default boolean isAdmin() {
        return false;
    }

    /**
     * whether roles are inherited.
     *
     * @return false | true
     */
    boolean isInherit();

    /**
     * role tag.
     *
     * @return role tag name
     */
    String getRoleTag();

    /**
     * permission sets for roles.
     *
     * @return permission sets
     */
    Set<PermissionDefinition> getPermissions();

    /**
     * permission set placeholder grouping.
     *
     * @return group placeholder
     */
    Map<Integer, Long> getGroupPermissionBit();

    /**
     * bitwise operation result of role permissions.
     *
     * @return long
     */
    long getBits();

    /**
     * whether it contain a permission.
     *
     * @param permission permission
     * @return false | true
     */
    boolean hasPermission(PermissionDefinition permission);

    /**
     * assign a permission set to a class instance.
     *
     * @param beanClass instance class
     * @return new instance object
     */
    <T> T permissionToBean(Class<T> beanClass);

    /**
     * assign a permission set to a class instance.
     *
     * @param beanClass instance class
     * @param feature   spatial global properties
     * @return new instance object
     */
    <T> T permissionToBean(Class<T> beanClass, SpaceGlobalFeature feature);
}
