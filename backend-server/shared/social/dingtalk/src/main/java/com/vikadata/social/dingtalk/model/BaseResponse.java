package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * responsive infrastructure
 */
@Setter
@Getter
@ToString
public class BaseResponse {
    private int errcode;

    private String errmsg;

    private Integer subCode;

    private String subMsg;
}
