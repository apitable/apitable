package com.vikadata.api.control.role;

/**
 * 扩展 Comparable 接口
 * 角色可compare
 * @author Shawn Deng
 * @date 2021-03-19 10:08:52
 */
public interface RoleComparable<T> extends Comparable<T> {

    /**
     * 比较同类型对象是否相等
     * @param other 比较的同类型对象
     * @return true 代表相等，false 代表不相等
     */
    boolean isEqualTo(T other);

    boolean isGreaterThan(T other);

    boolean isGreaterThanOrEqualTo(T other);

    boolean isLessThan(T other);

    boolean isLessThanOrEqualTo(T other);
}
