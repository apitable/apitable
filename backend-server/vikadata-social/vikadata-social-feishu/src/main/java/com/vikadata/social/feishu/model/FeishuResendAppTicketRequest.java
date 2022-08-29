package com.vikadata.social.feishu.model;

import lombok.Data;

/**
 * 重新推送 app_ticket 请求
 *
 * @author Shawn Deng
 * @date 2020-11-21 11:21:50
 */
@Data
public class FeishuResendAppTicketRequest {

    private String appId;

    private String appSecret;
}
