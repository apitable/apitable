package com.vikadata.integration.vika.model;


/**
 * <p>
 * 钉钉订单信息
 * </p>
 * @author zoe zheng
 * @date 2021/11/22 3:32 下午
 */
public class DingTalkOrderInfo {
    String corpId;

    String serviceStartTime;

    String serviceStopTime;

    String subscriptionType;

    String planId;

    String itemCode;

    String goodsCode;

    Boolean internal;

    String orderId;


    String createdAt;

    public String getCorpId() {
        return corpId;
    }

    public void setCorpId(String corpId) {
        this.corpId = corpId;
    }

    public String getServiceStartTime() {
        return serviceStartTime;
    }

    public void setServiceStartTime(String serviceStartTime) {
        this.serviceStartTime = serviceStartTime;
    }

    public String getServiceStopTime() {
        return serviceStopTime;
    }

    public void setServiceStopTime(String serviceStopTime) {
        this.serviceStopTime = serviceStopTime;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public Boolean getInternal() {
        return internal;
    }

    public void setInternal(Boolean internal) {
        this.internal = internal;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
