package com.vikadata.api.enums.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 第三方会员类型
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
@Getter
@AllArgsConstructor
public enum ThirdPartyMemberType {

    /**
     * 微信小程序
     */
    WECHAT_MINIAPP(0),

    /**
     * 微信公众号
     */
    WECHAT_PUBLIC_ACCOUNT(1),

    /**
     * 企业微信
     */
    ENTERPRISE_WECHAT(2),

    /**
     * QQ
     */
    TENCENT(3),

    /**
     * 钉钉
     */
    DING_TALK(4),

    /**
     * 飞书
     */
    FEI_SHU(5);

    private int type;
}
