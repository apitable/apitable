package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Call the enterprise domain domain name Ddns Api basic response data
 */
@Getter
@Setter
@ToString
public class EnpDdnsApiBaseResponse {

    private String error;

    private Boolean success;

}
