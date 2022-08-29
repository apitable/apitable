package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <p> 
 * 获取企业信息 响应
 * </p> 
 * @author Shawn Deng 
 * @date 2021/7/7 15:32
 */
@Setter
@Getter
public class FeishuTenantInfoResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private FeishuTenantInfo tenant;
    }
}
