package com.vikadata.social.wecom.event.order;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Wecom order basic content
 */
@Setter
@Getter
@ToString
public abstract class BaseWeComOrderEvent implements Serializable {

    /**
     * Application Suite ID
     */
    private String suiteId;

    /**
     * The business ID of the order
     */
    private String paidCorpId;

    /**
     * Enterprise order id
     */
    private String orderId;

}
