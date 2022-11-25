package com.vikadata.social.feishu.model;

import lombok.Data;

/**
 * re push the app_ticket request
 */
@Data
public class FeishuResendAppTicketRequest {

    private String appId;

    private String appSecret;
}
