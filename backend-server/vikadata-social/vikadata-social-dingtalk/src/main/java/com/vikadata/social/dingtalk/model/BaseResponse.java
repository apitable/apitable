package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 响应基础结构
 *
 * @author Zoe Zheng
 * @date 2021-04-06 17:40:17
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
