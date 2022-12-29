package com.vikadata.social.service.dingtalk.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SocialTenantDto {
    private String agentId;

    private Integer status;
}
