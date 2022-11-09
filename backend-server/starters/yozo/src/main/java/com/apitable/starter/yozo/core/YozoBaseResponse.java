package com.apitable.starter.yozo.core;

import com.fasterxml.jackson.annotation.JsonProperty;

public class YozoBaseResponse {

    private String message;

    @JsonProperty("errorcode")
    private Integer errorCode;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }
}
