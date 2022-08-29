package com.vikadata.api.enums.node;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 节点分享设置操作事件
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 21:59
 */
@Getter
@AllArgsConstructor
public enum NodeShareOperateEvent {

    /**
     * 开启分享
     */
    OPEN_SHARE(0, "开启", "分享"),

    /**
     * 关闭分享
     */
    CLOSE_SHARE(1, "关闭", "分享"),

    /**
     * 开启转存
     */
    OPEN_CLONEABLE(2, "开启", "允许他人保存"),

    /**
     * 关闭转存
     */
    CLOSE_CLONEABLE(3, "关闭", "允许他人保存"),

    /**
     * 刷新链接
     */
    REGENERATE_LINK(4, "刷新", "分享链接"),

    /**
     * 开启可编辑
     */
    OPEN_EDITABLE(5, "开启", "允许他人可编辑"),

    /**
     * 关闭可编辑
     */
    CLOSE_EDITABLE(6, "关闭", "允许他人可编辑");

    private int val;

    private String action;

    private String event;

    public int val() {
        return this.val;
    }

    public static NodeShareOperateEvent toEnum(int val) {
        for (NodeShareOperateEvent e : NodeShareOperateEvent.values()) {
            if (e.val() == val) {
                return e;
            }
        }
        throw new IllegalArgumentException("分享操作记录错误");
    }
}
