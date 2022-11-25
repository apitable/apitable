package com.vikadata.social.dingtalk.event.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.sync.http.BaseSyncHttpEvent;

/**
 * Event List -- Basic Order Information
 */
@Setter
@Getter
@ToString
public class BaseOrderEvent extends BaseSyncHttpEvent {
    /**
     * Order ID.
     */
    private String orderId;

    /**
     * The suite Key for the user to purchase the suite.
     */
    private String suiteKey;

    private String goodsName;

    private String goodsCode;

    private String itemName;

    /**
     * Specification code.
     */
    private String itemCode;

    /**
     * Purchase quantity.
     */
    private String subQuantity;

    /**
     * Service start time (unit: milliseconds).
     */
    private Long serviceStartTime;

    /**
     * Service end time (unit: milliseconds).
     */
    private Long serviceStopTime;

    /**
     * payFee
     * The actual price paid (unit: cents).
     * Description: This field is not returned when the articleType is image.
     */
    private Long payFee;

    /**
     * The main app product code associated with the in-app purchase product.
     * Description: This field has a value when the order is an in-app purchase order.
     */
    private String mainGoodsCode;

    /**
     * The name of the main app product associated with the in-app purchase product.
     * Description: This field has a value when the order is an in-app purchase order.
     */
    private String mainGoodsName;
}
