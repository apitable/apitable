package com.vikadata.entity;

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
 * 通知中心-通知记录表
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
@TableName(keepGlobalPrefix = true, value = "player_notification")
public class PlayerNotificationEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 发送用户，如果为0 这是系统用户
     */
    private Long fromUser;

    /**
     * 接收用户
     */
    private Long toUser;

    /**
     * 节点ID(冗余字段)
     */
    private String nodeId;

    /**
     * 通知模版ID
     */
    private String templateId;

    /**
     * 通知类型
     */
    private String notifyType;

    /**
     * 通知消息体
     */
    private String notifyBody;

    /**
     * 是否已读(0:否,1:是)
     */
    private Boolean isRead;

    /**
     * 删除标记(0:否,1:是)
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
