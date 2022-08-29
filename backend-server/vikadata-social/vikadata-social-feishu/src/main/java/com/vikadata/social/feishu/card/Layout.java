package com.vikadata.social.feishu.card;

/**
 * <p>
 * 交互元素布局
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 14:34
 */
public enum Layout {

    /**
     * 二等分布局
     */
    BISECTED,

    /**
     * 三等分布局
     */
    TRISECTION,

    /**
     * 流式布局
     */
    FLOW;

    public String value() {
        return this.name().toLowerCase();
    }
}
