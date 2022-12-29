package com.apitable.starter.vika.core.model;


/**
 * <p>
 * DingTalk product information
 * </p>
 *
 */
public class DingTalkGoodsInfo {

    /**
     * table ID
     */
    private Integer seats;

    /**
     * capacity
     */
    private Long capacity;

    /**
     * sku code
     */
    private String itemCode;

    /**
     * billing plan ID
     */
    private String billingPlanId;

    /**
     * vika product code
     */
    private String product;

    /**
     * period
     */
    private String period;

    /**
     * file number
     */
    private Integer nodes;

    /**
     * is internal product
     */
    private Boolean internal;

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public Long getCapacity() {
        return capacity;
    }

    public void setCapacity(Long capacity) {
        this.capacity = capacity;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getBillingPlanId() {
        return billingPlanId;
    }

    public void setBillingPlanId(String billingPlanId) {
        this.billingPlanId = billingPlanId;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Integer getNodes() {
        return nodes;
    }

    public void setNodes(Integer nodes) {
        this.nodes = nodes;
    }

    public Boolean getInternal() {
        return internal;
    }

    public void setInternal(Boolean internal) {
        this.internal = internal;
    }

}
