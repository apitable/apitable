package com.vikadata.integration.vika.model;

/**
 * <p>
 * 钉钉订阅信息
 * </p>
 *
 * @author Chambers
 * @date 2021/10/26
 */
public class DingTalkSubscriptionInfo {

    private String spaceId;

    private String spaceName;

    private String orderType;

    private String goodsCode;

    private String subscriptionType;

    private Integer seat;

    private Long serviceStartTime;

    private Long serviceStopTime;

    private String data;

    /**
     * 订单标签
     * 0：普通
     * 1：满赠
     */
    private Integer orderLabel;

    public String getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(String spaceId) {
        this.spaceId = spaceId;
    }

    public String getSpaceName() {
        return spaceName;
    }

    public void setSpaceName(String spaceName) {
        this.spaceName = spaceName;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public Integer getSeat() {
        return seat;
    }

    public void setSeat(Integer seat) {
        this.seat = seat;
    }

    public Long getServiceStartTime() {
        return serviceStartTime;
    }

    public void setServiceStartTime(Long serviceStartTime) {
        this.serviceStartTime = serviceStartTime;
    }

    public Long getServiceStopTime() {
        return serviceStopTime;
    }

    public void setServiceStopTime(Long serviceStopTime) {
        this.serviceStopTime = serviceStopTime;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Integer getOrderLabel() {
        return orderLabel;
    }

    public void setOrderLabel(Integer orderLabel) {
        this.orderLabel = orderLabel;
    }
}
