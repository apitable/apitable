package com.vikadata.entity;

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
 * 工作台-邀请记录表
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
@TableName(keepGlobalPrefix = true, value = "space_invite_record")
public class SpaceInviteRecordEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 邀请者成员ID
     */
    private Long inviteMemberId;

    /**
     * 邀请空间ID
     */
    private String inviteSpaceId;

    /**
     * 邀请空间名
     */
    private String inviteSpaceName;

    /**
     * 邀请邮箱
     */
    private String inviteEmail;

    /**
     * 邀请链接唯一令牌标识
     */
    private String inviteToken;

    /**
     * 邀请链接
     */
    private String inviteUrl;

    /**
     * 邮件发送状态(0:失败,1:成功)
     */
    private Boolean sendStatus;

    /**
     * 状态描述
     */
    private String statusDesc;

    /**
     * 是否已失效(0:否,1:是)
     */
    private Boolean isExpired;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
