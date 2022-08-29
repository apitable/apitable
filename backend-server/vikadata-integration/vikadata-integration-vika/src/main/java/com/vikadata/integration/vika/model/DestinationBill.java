package com.vikadata.integration.vika.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-28 09:53:10
 */
@JsonInclude(Include.NON_NULL)
public class DestinationBill {

    @JsonProperty("空间站ID")
    private String spaceId;

    @JsonProperty("空间站名称")
    private String spaceName;

    @JsonProperty("客户")
    private String customers;

    @JsonProperty("客户联系方式")
    private String customerContact;

    @JsonProperty("订阅类型")
    private String billingType;

    @JsonProperty("订阅套餐类型")
    private String billingProduct;

    @JsonProperty("席位")
    private Integer seat;

    @JsonProperty("付费计划")
    private List<String> planName;

    @JsonProperty("周期时长(单位:月)")
    private Integer duration;

    @JsonProperty("权益生效时间")
    private Long startDate;

    @JsonProperty("环境")
    private String environment;

    @JsonProperty("备注")
    private String remark;

    @JsonProperty("附件")
    private List<AttachmentField> attachments;

    @JsonProperty("源创建时间")
    private Long originalCreateDate;

    @JsonProperty("对接人")
    private List<MemberField> contact;

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

    public String getCustomers() {
        return customers;
    }

    public void setCustomers(String customers) {
        this.customers = customers;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getBillingType() {
        return billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public String getBillingProduct() {
        return billingProduct;
    }

    public void setBillingProduct(String billingProduct) {
        this.billingProduct = billingProduct;
    }

    public Integer getSeat() {
        return seat;
    }

    public void setSeat(Integer seat) {
        this.seat = seat;
    }

    public List<String> getPlanName() {
        return planName;
    }

    public void setPlanName(List<String> planName) {
        this.planName = planName;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(Long startDate) {
        this.startDate = startDate;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<AttachmentField> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentField> attachments) {
        this.attachments = attachments;
    }

    public Long getOriginalCreateDate() {
        return originalCreateDate;
    }

    public void setOriginalCreateDate(Long originalCreateDate) {
        this.originalCreateDate = originalCreateDate;
    }

    public List<MemberField> getContact() {
        return contact;
    }

    public void setContact(List<MemberField> contact) {
        this.contact = contact;
    }
}
