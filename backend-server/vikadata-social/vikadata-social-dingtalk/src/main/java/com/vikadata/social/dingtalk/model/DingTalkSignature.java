package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 签名计算需要的数据
 * </p>
 * @author zoe zheng
 * @date 2021/5/7 4:23 下午
 */
@Setter
@Getter
@ToString
public class DingTalkSignature {

    /**
     * 应用的唯一标识key
     */
    private String accessKey;

    /**
     * 钉钉推送的suiteTicket,定制应用可随意填写,第三方企业应用使用钉钉开放平台向应用推送的suite_ticket
     */
    private String suiteTicket;

    /**
     * 应用的secret
     */
    private String appSecret;
}
