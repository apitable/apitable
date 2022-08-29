package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 操作企业域名响应参数
 * </p>
 *
 * @author Pengap
 * @date 2021/8/3 14:33:48
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
