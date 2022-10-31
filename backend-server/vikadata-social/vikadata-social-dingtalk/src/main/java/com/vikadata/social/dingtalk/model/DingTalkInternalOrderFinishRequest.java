package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get the SKU page address of in-app purchase products
 */
@Setter
@Getter
@ToString
public class DingTalkInternalOrderFinishRequest {
    /**
     * In-app purchase order number.
     */
    private Long bizOrderId;
}
