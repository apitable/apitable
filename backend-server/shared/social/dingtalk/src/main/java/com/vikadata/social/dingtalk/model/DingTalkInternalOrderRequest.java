package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get in-app purchase order information
 */
@Setter
@Getter
@ToString
public class DingTalkInternalOrderRequest {
    /**
     * In-app purchase order number
     */
    private Long bizOrderId;
}
