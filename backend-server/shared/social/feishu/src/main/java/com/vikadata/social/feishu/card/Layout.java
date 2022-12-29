package com.vikadata.social.feishu.card;

/**
 * Interactive element layout
 */
public enum Layout {

    /**
     * Bisection layout
     */
    BISECTED,

    /**
     * Three equal layout
     */
    TRISECTION,

    /**
     * Flow layout
     */
    FLOW;

    public String value() {
        return this.name().toLowerCase();
    }
}
