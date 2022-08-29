package com.vikadata.api.modular.eco.lang;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-14 17:43:08
 */
@Deprecated
public enum SystemTagDefinition {

    TEST("001", 0);

    private final String id;

    /**
     * 0: 系统标签
     * 1.....待定
     */
    private final int type;

    SystemTagDefinition(String id, int type) {
        this.id = id;
        this.type = type;
    }

    public String getId() {
        return id;
    }
}
