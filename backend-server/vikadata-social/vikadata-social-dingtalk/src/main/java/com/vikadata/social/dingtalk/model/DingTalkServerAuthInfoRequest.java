package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取授权企业授权信息/企业信息
 * </p>
 * @author zoe zheng
 * @date 2021/4/6 6:49 下午
 */
@Getter
@Setter
@ToString
public class DingTalkServerAuthInfoRequest {
    /**
     * 非必填，第三方应用的Suitekey
     */
    private String suiteKey;

    /**
     * 授权方的CorpId
     */
    private String authCorpid;
}
