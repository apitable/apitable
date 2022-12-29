package com.vikadata.social.service.dingtalk.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * Third Party Platform Integration - Enterprise Tenant Table
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_social_tenant")
public class SocialTenantEntity implements Serializable {
    private static final long serialVersionUID = -7883315356591206506L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    private String appId;

    private Integer appType;

    private String tenantId;

    private String contactAuthScope;

    private String authInfo;

    private Integer status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @TableLogic
    private Boolean isDeleted;

}
