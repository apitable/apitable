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
     * Generated temporary jsapi ticket.
     */
    private String ticket;

    /**
     * The expiration time of the access token, in seconds
     */
    private int expiresIn;
}
