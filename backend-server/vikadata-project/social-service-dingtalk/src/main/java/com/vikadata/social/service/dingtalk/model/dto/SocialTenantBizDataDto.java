package com.vikadata.social.service.dingtalk.model.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 企业基本信息
 *
 * @author Zoe Zheng
 * @date 2021-08-31 16:35:09
 */
@Data
@Builder(toBuilder = true)
public class SocialTenantBizDataDto {
    private Integer bizType;

    private String bizId;

    private String  bizData;
}
