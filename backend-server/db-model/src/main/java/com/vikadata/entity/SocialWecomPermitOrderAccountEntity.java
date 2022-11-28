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
 * 企微服务商接口许可账号信息
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
@TableName(keepGlobalPrefix = true, value = "social_wecom_permit_order_account")
public class SocialWecomPermitOrderAccountEntity implements Serializable {

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
     * 帐号类型。1：基础帐号；2：互通帐号
     */
    private Integer type;

    /**
     * 帐号状态。1：未绑定；2：已绑定且有效；3：已过期；4：待转移
     */
    private Integer activateStatus;

    /**
     * 账号激活码
     */
    private String activeCode;

    /**
     * 账号绑定激活的企微用户 ID
     */
    private String cpUserId;

    /**
     * 创建时间，订单支付成功后立即创建
     */
    private LocalDateTime createTime;

    /**
     * 首次激活绑定用户的时间
     */
    private LocalDateTime activeTime;

    /**
     * 过期时间。为首次激活绑定的时间加上购买时长
     */
    private LocalDateTime expireTime;

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
