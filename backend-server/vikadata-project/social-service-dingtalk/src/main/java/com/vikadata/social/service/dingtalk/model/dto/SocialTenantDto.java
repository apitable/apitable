package com.vikadata.social.service.dingtalk.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * 企业基本信息
 *
 * @author Zoe Zheng
 * @date 2021-08-31 16:35:09
 */
@Data
@Getter
@Setter
public class SocialTenantDto {
    private String agentId;

    private Integer status;
}
