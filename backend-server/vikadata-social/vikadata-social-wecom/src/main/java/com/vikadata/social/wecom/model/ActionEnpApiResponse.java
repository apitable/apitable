package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Manipulating Enterprise Domain Response Parameters
 */
@Getter
@Setter
@ToString
public class ActionEnpApiResponse extends EnpDdnsApiBaseResponse {

    private Data data;

    @Getter
    @Setter
    @ToString
    public static class Data {

        private String domainName;

    }

}
