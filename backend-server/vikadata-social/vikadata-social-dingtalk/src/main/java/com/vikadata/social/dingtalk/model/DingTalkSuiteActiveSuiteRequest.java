package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 激活应用
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/15 7:48 下午
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteActiveSuiteRequest {

    /**
     * 第三方应用的suiteKey。可在开发者后台的应用详情页获取。
     */
    private String suiteKey;

    /**
     * 授权企业的CorpId。HTTP回调事件中推送的CorpId。
     */
    private String authCorpid;

    /**
     * 授权企业的永久授权码。
     */
    private String permanentCode;
}
