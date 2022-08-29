package com.vikadata.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;

/**
 * <p> 
 * 第三方平台集成 - 企业微信第三方服务商应用消息通知信息
 * </p> 
 * @author 刘斌华
 * @date 2022-01-05 16:47:03
 */
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Builder
@TableName("vika_social_cp_isv_event_log")
public class SocialCpIsvMessageEntity {

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 消息通知类型。1：create_auth，授权成功；2：change_auth，变更授权；3：cancel_auth，取消授权；
     * 11：suite_ticket，第三方服务 suite_ticket；
     * 21：change_contact，应用变更成员
     */
    private Integer type;

    /**
     * 应用套件 ID。对应平台中的 appId
     */
    private String suiteId;

    /**
     * 信息类型
     */
    private String infoType;

    /**
     * 授权的企业 ID。对应平台中的 tenantId
     */
    private String authCorpId;

    /**
     * 时间戳
     */
    private Long timestamp;

    /**
     * 整个消息体
     */
    private String message;

    /**
     * 处理状态。1：待处理；2：处理失败，需要重试；3：处理失败，结束；4：处理成功
     */
    private Integer processStatus;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    @Tolerate
    public SocialCpIsvMessageEntity() {
        // default constructor
    }

}
