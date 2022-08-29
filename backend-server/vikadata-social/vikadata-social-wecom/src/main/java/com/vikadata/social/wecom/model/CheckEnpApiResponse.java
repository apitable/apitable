package com.vikadata.social.wecom.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 校验企业域名响应参数
 * </p>
 *
 * @author Pengap
 * @date 2021/8/4 11:16:12
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
