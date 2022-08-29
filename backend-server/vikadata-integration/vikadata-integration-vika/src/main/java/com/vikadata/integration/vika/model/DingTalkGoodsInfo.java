package com.vikadata.integration.vika.model;


/**
 * <p> 
 * 钉钉商品信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/26 17:45
 */

public class DingTalkGoodsInfo {

    /**
     * 表ID
     */
    private Integer seats;

    /**
     * 附件容量
     */
    private Long capacity;

    /**
     * sku 码
     */
    private String itemCode;

    /**
     * 订阅计划ID
     */
    private String billingPlanId;

    /**
     * vika产品编码
     */
    private String product;

    /**
     * 周期
     */
    private String period;

    /**
     * 文件数量
     */
    private Integer nodes;

    /**
     * 是否是内购商品
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
