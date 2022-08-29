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
 * <p>
 * 第三方平台集成-企业租户表
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-05-20
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

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 应用标识
     */
    private String appId;

    /**
     * 应用类型(1: 企业内部应用, 2: 独立服务商)
     */
    private Integer appType;

    /**
     * 企业的唯一标识，各大平台名词不一致，这里统一使用租户表示
     */
    private String tenantId;

    /**
     * 通讯录权限范围
     */
    private String contactAuthScope;

    /**
     * 企业授权信息
     */
    private String authInfo;

    /**
     * 状态(0: 停用, 1: 启用)
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

}
