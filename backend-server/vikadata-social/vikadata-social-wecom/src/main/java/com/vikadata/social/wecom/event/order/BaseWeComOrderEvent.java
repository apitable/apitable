package com.vikadata.social.wecom.event.order;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 企微订单基础内容
 * </p>
 * @author 刘斌华
 * @date 2022-08-10 11:15:19
 */
@Setter
@Getter
@ToString
public abstract class BaseWeComOrderEvent implements Serializable {

    /**
     * 应用套件 ID
     */
    private String suiteId;

    /**
     * 下单的企业 ID
     */
    private String paidCorpId;

    /**
     * 企微订单号
     */
    private String orderId;

}
