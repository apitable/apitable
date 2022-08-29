package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p> 
 * 租户绑定空间站基本信息 
 * </p> 
 * @author zoe zheng 
 * @date 2021/5/12 2:20 下午
 */
@Data
public class TenantBindDTO {

    private String spaceId;

    /**
     * 企业的唯一标识，各大平台名词不一致，这里统一使用租户表示
     */
    private String tenantId;

    /**
     * 应用唯一标识
     */
    private String appId;
}
