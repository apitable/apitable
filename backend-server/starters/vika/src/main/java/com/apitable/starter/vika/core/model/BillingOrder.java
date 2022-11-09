package com.apitable.starter.vika.core.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import com.apitable.starter.vika.core.jackson.LocalDateTimeToUnixSerializer;
import com.apitable.starter.vika.core.jackson.OrderChannelSerializer;
import com.apitable.starter.vika.core.jackson.OrderTypeSerializer;

public class BillingOrder {

    @JsonProperty("订单ID")
    private String orderId;

    @JsonProperty("空间ID")
    private String spaceId;

    @JsonProperty("渠道")
    @JsonSerialize(using = OrderChannelSerializer.class)
    private String orderChannel;

    @JsonProperty("渠道订单ID")
    private String channelOrderId;

    @JsonProperty("订单类型")
    @JsonSerialize(using = OrderTypeSerializer.class)
    private String orderType;

    @JsonProperty("原价")
    private BigDecimal originalAmount;

    @JsonProperty("优惠金额")
    private BigDecimal discountAmount;

    @JsonProperty("支付金额")
    private BigDecimal amount;

    @JsonProperty("下单时间")
    @JsonSerialize(using = LocalDateTimeToUnixSerializer.class)
    private LocalDateTime createdTime;

    @JsonProperty("是否支付")
    private Boolean isPaid;

    @JsonProperty("支付时间")
    @JsonSerialize(using = LocalDateTimeToUnixSerializer.class)
    private LocalDateTime paidTime;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(String spaceId) {
        this.spaceId = spaceId;
    }

    public String getOrderChannel() {
        return orderChannel;
    }

    public void setOrderChannel(String orderChannel) {
        this.orderChannel = orderChannel;
    }

    public String getChannelOrderId() {
        return channelOrderId;
    }

    public void setChannelOrderId(String channelOrderId) {
        this.channelOrderId = channelOrderId;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public Boolean getPaid() {
        return isPaid;
    }

    public void setPaid(Boolean paid) {
        isPaid = paid;
    }

    public LocalDateTime getPaidTime() {
        return paidTime;
    }

    public void setPaidTime(LocalDateTime paidTime) {
        this.paidTime = paidTime;
    }
}
