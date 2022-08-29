package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取 app_access_token
 * </p>
 * @author zoe zheng
 * @date 2021/4/6 6:49 下午
 */
@Getter
@Setter
@ToString
public class DingTalkCorpAccessTokenRequest {
    /**
     * 授权企业的CorpId
     */
    private String authCorpid;
}
