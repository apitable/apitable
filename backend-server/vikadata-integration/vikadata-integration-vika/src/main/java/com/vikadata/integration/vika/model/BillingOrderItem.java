package com.vikadata.integration.vika.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import com.vikadata.integration.vika.jackson.LocalDateTimeToUnixSerializer;

public class BillingOrderItem {

    @JsonProperty("订单ID")
    private String orderId;

    @JsonProperty("产品")
    private String productName;

    @JsonProperty("产品类型")
    private String productCategory;

    @JsonProperty("席位")
    private Integer seat;

    @JsonProperty("订阅月数")
    private Integer months;

    @JsonProperty("开始时间")
    @JsonSerialize(using = LocalDateTimeToUnixSerializer.class)
    private LocalDateTime startDate;

    @JsonProperty("结束时间")
    @JsonSerialize(using = LocalDateTimeToUnixSerializer.class)
    private LocalDateTime endDate;

    @JsonProperty("金额")
    private BigDecimal amount;

    @JsonProperty("所属订单")
    private List<String> orderIds;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public Integer getSeat() {
        return seat;
    }

    public void setSeat(Integer seat) {
        this.seat = seat;
    }

    public Integer getMonths() {
        return months;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public List<String> getOrderIds() {
        return orderIds;
    }

    public void setOrderIds(List<String> orderIds) {
        this.orderIds = orderIds;
    }
}
