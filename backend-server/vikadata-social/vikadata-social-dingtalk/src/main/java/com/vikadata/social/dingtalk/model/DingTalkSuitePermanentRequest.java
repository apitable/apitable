package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取授权企业的永久授权码
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/15 7:57 下午
 */
@Setter
@Getter
@ToString
public class DingTalkSuitePermanentRequest {

    /**
     * 回调接口（tmp_auth_code）获取的临时授权码。
     */
    private String tmpAuthCode;
}
