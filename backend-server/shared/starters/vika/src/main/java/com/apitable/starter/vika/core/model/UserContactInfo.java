package com.apitable.starter.vika.core.model;

/**
 * user contact information
 */
public class UserContactInfo {

    private String recordId;

    private String uuid;

    private String code;

    private String mobilePhone;

    private String email;

    private final static String USER_NOT_BIND_PHONE = "USER NOT BIND PHONE";

    private final static String USER_NOT_BIND_EMIAL = "USER NOT BIND EMAIL";

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getCode() {
        if(code == null){
            return USER_NOT_BIND_PHONE;
        }
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMobilePhone() {
        if(mobilePhone == null){
            return USER_NOT_BIND_PHONE;
        }
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getEmail() {
        if(email == null){
            return USER_NOT_BIND_EMIAL;
        }
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}