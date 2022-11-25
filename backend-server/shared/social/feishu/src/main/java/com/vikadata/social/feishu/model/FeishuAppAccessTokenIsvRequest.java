package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/21 16:33
 */
@Setter
@Getter
@ToString
public class FeishuAppAccessTokenIsvRequest {

    private String appId;

    private String appSecret;

    private String appTicket;
}
