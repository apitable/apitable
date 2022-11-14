package com.vikadata.api.user.enums;

import com.vikadata.core.exception.BusinessException;

/**
 * <p>
 * User Link Type
 * </p>
 *
 * @author Chambers
 */
public enum LinkType {

    DINGTALK(0),

    WECHAT(1),

    TENCENT(2),

    FEISHU(3);

    private final int type;

    LinkType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public static LinkType toEnum(Integer type) {
        for (LinkType e : LinkType.values()) {
            if (e.getType() == type) {
                return e;
            }
        }
        throw new BusinessException("unknown link type");
    }
}
