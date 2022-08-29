package com.vikadata.social.service.dingtalk.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 第三方平台集成-企业租户用户表
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
@TableName("vika_social_tenant_user")
public class SocialTenantUserEntity implements Serializable {

    private static final long serialVersionUID=1L;

      /**
     * 主键
     */
      @TableId(value = "id", type = IdType.ASSIGN_ID)
      private Long id;

      /**
     * 企业标识
     */
      private String tenantId;

      /**
     * 第三方平台用户ID，应用内唯一
     */
      private String openId;

      /**
     * 用户在平台唯一标识
     */
      private String unionId;

      /**
     * 创建时间
     */
      private LocalDateTime createdAt;

      /**
     * 更新时间
     */
      private LocalDateTime updatedAt;


}
