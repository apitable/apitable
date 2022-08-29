package com.vikadata.api.cache.bean;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 用户关联信息
 * </p>
 *
 * @author Chambers
 * @date 2020/8/26
 */
@Data
public class UserLinkInfo {

    /**
     * 开发者令牌
     */
    private String apiKey;

    /**
     * 帐号关联第三方信息
     */
    private List<AccountLinkDto> accountLinkList;

    /**
     * 引导相关状态值
     */
    private String wizards;

    /**
     * 个人邀请码
     */
    private String inviteCode;
}
