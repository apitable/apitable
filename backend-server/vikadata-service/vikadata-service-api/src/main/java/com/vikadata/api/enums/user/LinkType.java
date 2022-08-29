package com.vikadata.api.enums.user;

import com.vikadata.core.exception.BusinessException;

/**
 * <p>
 * 帐号关联的第三方类型
 * </p>
 *
 * @author Chambers
 * @date 2020/2/22
 */
public enum LinkType {

    /**
     * 钉钉
     */
    DINGTALK(0),

    /**
     * 微信
     */
    WECHAT(1),

    /**
     * QQ
     */
    TENCENT(2),

    /**
     * 飞书
     */
    FEISHU(3);

    private int type;

    LinkType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public static LinkType toEnum(Integer type) {
        for (LinkType e : LinkType.values()) {
            if (e.getType() == type) {
                return e;
            }
        }
        throw new BusinessException("未知的第三方帐号关联类型");
    }
}
