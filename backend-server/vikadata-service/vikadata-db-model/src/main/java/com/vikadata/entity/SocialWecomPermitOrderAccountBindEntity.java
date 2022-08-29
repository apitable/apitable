package com.vikadata.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import lombok.experimental.Accessors;

/**
 * <p>
 * 企微服务商接口许可账号绑定信息
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_social_wecom_permit_order_account_bind")
public class SocialWecomPermitOrderAccountBindEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键 ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 应用套件 ID
     */
    private String suiteId;

    /**
     * 授权的企业 ID
     */
    private String authCorpId;

    /**
     * 接口许可的订单号
     */
    private String orderId;

    /**
     * 新购订单的激活码
     */
    private String activeCode;

    /**
     * 续期订单的企微用户 ID
     */
    private String cpUserId;

    /**
     * 删除标记。0：否；1：是
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;


}
