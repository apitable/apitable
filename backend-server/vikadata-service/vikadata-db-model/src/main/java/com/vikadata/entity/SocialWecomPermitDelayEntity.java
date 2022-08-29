package com.vikadata.entity;

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
import lombok.experimental.Accessors;

/**
 * <p>
 * 企微服务商接口许可延时任务处理信息
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
@TableName("vika_social_wecom_permit_delay")
public class SocialWecomPermitDelayEntity {

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
     * 首次授权安装时间
     */
    private LocalDateTime firstAuthTime;

    /**
     * 延时处理类型。1：接口许可免费试用过期通知；2：企业付费延时购买接口许可
     */
    private Integer delayType;

    /**
     * 处理状态。0：待处理；1：已发送到队列；5：已下单；9：已完成
     */
    private Integer processStatus;

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
