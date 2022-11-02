package com.vikadata.api.control.role;

/**
 * Role Extend Comparable interface
 * @author Shawn Deng
 */
public interface RoleComparable<T> extends Comparable<T> {

    boolean isEqualTo(T other);

    boolean isGreaterThan(T other);

    boolean isGreaterThanOrEqualTo(T other);

    boolean isLessThan(T other);

    boolean isLessThanOrEqualTo(T other);
}
