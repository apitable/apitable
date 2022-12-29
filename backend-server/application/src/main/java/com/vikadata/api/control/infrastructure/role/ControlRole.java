package com.vikadata.api.control.infrastructure.role;

import java.util.Map;
import java.util.Set;

import com.vikadata.api.control.infrastructure.permission.PermissionDefinition;
import com.vikadata.api.space.vo.SpaceGlobalFeature;

/**
 * role attribute interface
 * @author Shawn Deng
 */
public interface ControlRole extends RoleComparable<ControlRole> {

    /**
     * Whether it is possible to set assignment to organizational unit
     * @return false | true
     */
    default boolean canAssignable() {
        return true;
    }

    /**
     * is it an administrator
     * @return false | true
     */
    default boolean isAdmin() {
        return false;
    }

    /**
     * whether roles are inherited
     * @return false | true
     */
    boolean isInherit();

    /**
     * role tag
     * @return role tag name
     */
    String getRoleTag();

    /**
     * permission sets for roles
     * @return permission sets
     */
    Set<PermissionDefinition> getPermissions();

    /**
     * permission set placeholder grouping
     * @return group placeholder
     */
    Map<Integer, Long> getGroupPermissionBit();

    /**
     * bitwise operation result of role permissions
     * @return long
     */
    long getBits();

    /**
     * whether it contain a permission
     * @param permission permission
     * @return false | true
     */
    boolean hasPermission(PermissionDefinition permission);

    /**
     * assign a permission set to a class instance
     * @param beanClass instance class
     * @return new instance object
     */
    <T> T permissionToBean(Class<T> beanClass);

    /**
     * assign a permission set to a class instance
     *
     * @param beanClass instance class
     * @param feature   spatial global properties
     * @return new instance object
     */
    <T> T permissionToBean(Class<T> beanClass, SpaceGlobalFeature feature);
}
