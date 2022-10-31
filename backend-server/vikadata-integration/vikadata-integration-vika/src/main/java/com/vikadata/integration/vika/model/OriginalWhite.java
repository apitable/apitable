package com.vikadata.integration.vika.model;

import java.util.List;

/**
 * Original white list
 * duration
 */
public class OriginalWhite {

    private String recordId;

    private String spaceId;

    private String spaceName;

    private String customers;

    private String customerContact;

    private String billingProduct;

    private Integer billingSeat;

    private Integer billingDuration;

    private List<String> plans;

    private Long startDate;

    private List<String> contact;

    private Long originalCreateDate;

    private List<AttachmentField> attachments;

    private String description;

    private String migrateStatus;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

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

    public String getBillingProduct() {
        return billingProduct;
    }

    public void setBillingProduct(String billingProduct) {
        this.billingProduct = billingProduct;
    }

    public Integer getBillingSeat() {
        return billingSeat;
    }

    public void setBillingSeat(Integer billingSeat) {
        this.billingSeat = billingSeat;
    }

    public Integer getBillingDuration() {
        return billingDuration;
    }

    public void setBillingDuration(Integer billingDuration) {
        this.billingDuration = billingDuration;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(Long startDate) {
        this.startDate = startDate;
    }

    public List<String> getContact() {
        return contact;
    }

    public void setContact(List<String> contact) {
        this.contact = contact;
    }

    public Long getOriginalCreateDate() {
        return originalCreateDate;
    }

    public void setOriginalCreateDate(Long originalCreateDate) {
        this.originalCreateDate = originalCreateDate;
    }

    public List<AttachmentField> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentField> attachments) {
        this.attachments = attachments;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMigrateStatus() {
        return migrateStatus;
    }

    public void setMigrateStatus(String migrateStatus) {
        this.migrateStatus = migrateStatus;
    }

    public List<String> getPlans() {
        return plans;
    }

    public void setPlans(List<String> plans) {
        this.plans = plans;
    }
}
