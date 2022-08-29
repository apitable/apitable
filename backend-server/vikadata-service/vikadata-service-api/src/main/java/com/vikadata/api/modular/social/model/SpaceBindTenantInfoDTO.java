package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * <p> 
 * 空间站绑定租户信息视图
 * </p> 
 * @author Pengap
 * @date 2021/8/16 11:21:52
 */
@Data
public class SpaceBindTenantInfoDTO {

    private String spaceId;

    /**
     * 企业的唯一标识，各大平台名词不一致，这里统一使用租户表示
     */
    private String tenantId;

    /**
     * 应用唯一标识
     */
    private String appId;

    /**
     * 所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)
     */
    private Integer platform;

    /**
     * 应用类型(1: 企业内部应用, 2: 独立服务商)
     */
    private Integer appType;

    /**
     * 授权模式。1：企业授权；2：成员授权
     */
    private Integer authMode;

    /**
     * 应用授权信息
     */
    private Object authInfo;

    /**
     * 状态
     */
    private Boolean status;

    @JsonIgnore
    private String authInfoStr;

}
