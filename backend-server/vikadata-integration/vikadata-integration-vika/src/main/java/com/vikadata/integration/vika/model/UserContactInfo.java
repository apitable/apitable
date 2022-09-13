package com.vikadata.integration.vika.model;

public class UserContactInfo {

    private String recordId;

    private String uuid;

    private String code;

    private String mobilePhone;

    private String email;

    public final static String USER_NOT_BIND_PHONE = "USER NOT BIND PHONE";

    public final static String USER_NOT_BIND_EMIAL = "USER NOT BIND EMAIL";

    public final static String USER_NOT_EXIST_OR_BAN = "USER NOT EXIST OR BAN";

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