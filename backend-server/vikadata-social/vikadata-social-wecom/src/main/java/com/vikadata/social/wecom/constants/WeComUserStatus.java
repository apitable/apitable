package com.vikadata.social.wecom.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.social.wecom.exception.WeComApiException;

/**
 * <p>
 * 企业微信成员激活状态 </br>
 *
 * 激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。
 * </p>
 *
 * @author Pengap
 * @date 2021/8/11 15:07:58
 */
@AllArgsConstructor
@Getter
public enum WeComUserStatus {

    /**
     * 已激活
     */
    ACTIVE(1),

    /**
     * 已禁用
     */
    DISABLED(2),

    /**
     * 未激活
     */
    NOT_ACTIVE(4),

    /**
     * 退出企业
     */
    EXITED(5),
    ;

    private Integer code;

    public static WeComUserStatus of(Integer code) {
        for (WeComUserStatus e : WeComUserStatus.values()) {
            if (e.getCode().equals(code)) {
                return e;
            }
        }
        throw new WeComApiException("用户状态获取异常");
    }

}
