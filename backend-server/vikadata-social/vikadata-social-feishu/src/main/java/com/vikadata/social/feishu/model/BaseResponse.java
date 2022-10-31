package com.vikadata.social.feishu.model;

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

    private int code;

    private String msg;
}
