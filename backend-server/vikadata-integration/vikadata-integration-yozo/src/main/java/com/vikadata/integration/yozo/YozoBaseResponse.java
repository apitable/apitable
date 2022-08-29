package com.vikadata.integration.yozo;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-22 12:15:23
 */
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
