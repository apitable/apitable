package com.vikadata.social.service.dingtalk.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class SocialTenantBizDataDto {
    private Integer bizType;

    private String bizId;

    private String bizData;
}
