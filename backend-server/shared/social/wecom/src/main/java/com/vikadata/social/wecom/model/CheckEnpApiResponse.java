package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Verify the corporate domain name response parameters
 */
@Getter
@Setter
@ToString
public class CheckEnpApiResponse extends EnpDdnsApiBaseResponse {

    private Data data;

    @Getter
    @Setter
    @ToString
    public static class Data {

        private String domainName;

        private String ipList;

    }

}
