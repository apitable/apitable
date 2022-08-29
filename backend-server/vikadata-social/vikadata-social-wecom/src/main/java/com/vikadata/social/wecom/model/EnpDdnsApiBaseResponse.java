package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 调用企业域域名DdnsApi基础响应数据
 * </p>
 *
 * @author Pengap
 * @date 2021/8/3 14:31:37
 */
@Getter
@Setter
@ToString
public class EnpDdnsApiBaseResponse {

    private String error;

    private Boolean success;

}
