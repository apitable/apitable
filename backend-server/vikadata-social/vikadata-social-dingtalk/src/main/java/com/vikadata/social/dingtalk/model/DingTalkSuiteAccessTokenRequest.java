package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取第三方企业应用的suite_access_token
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/15 7:48 下午
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteAccessTokenRequest {

    /**
     * 第三方应用的suiteKey。可在开发者后台的应用详情页获取。
     */
    private String suiteKey;

    /**
     * 钉钉推送的suiteTicket,定制应用可随意填写,第三方企业应用使用钉钉开放平台向应用推送的suite_ticket
     */
    private String suiteTicket;

    /**
     * 第三方应用的suiteSecret，可在开发者后台的应用详情页获取。
     */
    private String suiteSecret;
}
