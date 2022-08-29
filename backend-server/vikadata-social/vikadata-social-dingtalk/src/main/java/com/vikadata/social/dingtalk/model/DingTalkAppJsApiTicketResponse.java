package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * js api ticket
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/30 14:51
 */
@Setter
@Getter
@ToString
public class DingTalkAppJsApiTicketResponse extends BaseResponse {
    /**
     * 生成的临时jsapi_ticket。
     */
    private String ticket;

    /**
     * access_token的过期时间，单位秒
     */
    private int expiresIn;
}
