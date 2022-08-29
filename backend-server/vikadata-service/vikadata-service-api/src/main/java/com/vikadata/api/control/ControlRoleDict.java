package com.vikadata.api.control;

import java.util.LinkedHashMap;

import com.vikadata.api.control.role.ControlRole;

/**
 * 工作台控制权限字段对象，扩展了 LinkedHashMap
 * @author Shawn Deng
 * @date 2021-03-18 10:49:06
 */
public class ControlRoleDict extends LinkedHashMap<String, ControlRole> {

    private static final long serialVersionUID = -7810769751186072489L;

    /**
     * 默认容量增长因子
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /**
     * 默认容量
     */
    static final int DEFAULT_CAPACITY = 1 << 4;

    public static ControlRoleDict create() {
        return new ControlRoleDict();
    }

    /**
     * 空构造器
     */
    public ControlRoleDict() {
        this(DEFAULT_CAPACITY);
    }

    /**
     * 构造器
     *
     * @param initialCapacity 初始容量
     */
    public ControlRoleDict(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    /**
     * 构造器
     *
     * @param initialCapacity 初始容量
     * @param loadFactor 容量增长因子，0~1，即达到容量的百分之多少时扩容
     */
    public ControlRoleDict(int initialCapacity, float loadFactor) {
        super(initialCapacity, loadFactor);
    }

    @Override
    public ControlRoleDict clone() {
        return (ControlRoleDict) super.clone();
    }
}
