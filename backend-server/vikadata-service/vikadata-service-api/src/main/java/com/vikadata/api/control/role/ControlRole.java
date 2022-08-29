package com.vikadata.api.control.role;

import java.util.Map;
import java.util.Set;

import com.vikadata.api.control.permission.PermissionDefinition;
import com.vikadata.api.lang.SpaceGlobalFeature;

/**
 * 角色 属性 抽象接口
 * @author Shawn Deng
 * @date 2021-03-18 11:00:49
 */
public interface ControlRole extends RoleComparable<ControlRole> {

    /**
     * 是否可设置分配给组织单元
     * @return false | true
     */
    default boolean canAssignable() {
        return true;
    }

    /**
     * 是否管理员
     * @return false | true
     */
    default boolean isAdmin() {
        return false;
    }

    /**
     * 是否角色是继承的
     * @return false | true
     */
    boolean isInherit();

    /**
     * 角色标签
     * @return 角色标签名称
     */
    String getRoleTag();

    /**
     * 角色的权限集
     * @return 权限集
     */
    Set<PermissionDefinition> getPermissions();

    /**
     * 权限集占位分组
     * @return 分组占位
     */
    Map<Integer, Long> getGroupPermissionBit();

    /**
     * 角色权限的位运算结果
     * @return 角色权限码位运算
     */
    long getBits();

    /**
     * 是否包含某权限
     * @param permission 权限功能点
     * @return false | true
     */
    boolean hasPermission(PermissionDefinition permission);

    /**
     * 将权限集赋予类实例
     * @param beanClass 实例类
     * @return 新实例对象
     */
    <T> T permissionToBean(Class<T> beanClass);

    /**
     * 将权限集赋予类实例
     *
     * @param beanClass 实例类
     * @param feature   空间全局属性
     * @return 新实例对象
     * @author Chambers
     * @date 2021/5/21
     */
    <T> T permissionToBean(Class<T> beanClass, SpaceGlobalFeature feature);
}
