package com.vikadata.api.modular.finance.model;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class CustomerOrder {

    @JsonProperty("RECORD_ID")
    private String recordId;

    @JsonProperty("订单编号")
    private String orderNo;

    @JsonProperty("空间站ID")
    private String spaceId;

    @JsonProperty("TCV")
    private BigDecimal contractPrice;

    @JsonProperty("下单方式")
    private String orderTakenMethod;

    @JsonProperty("订单类型")
    private String paymentMethod;

    @JsonProperty("基础订阅")
    private String billingProduct;

    @JsonProperty("订阅席位")
    private Integer billingSeat;

    @JsonProperty("订阅时长（单位：月）")
    private Integer billingDuration;

    @JsonProperty("开通时间")
    private Long startDate;

    @JsonProperty("创建时间")
    private Long createdTime;

    @JsonProperty("实际成交人")
    private List<String> transactionEmployee;

    @JsonProperty("备注")
    private String description;

    @JsonProperty("类型")
    private String type;

    @JsonProperty("强制过期")
    private boolean focusExpired;

    @JsonProperty("不需要处理")
    private boolean noNeed;
}
