package com.vikadata.api.model.dto.player;

import lombok.Data;

/**
 * <p>
 * player 通知
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/21 10:58 上午
 */
@Data
public class NotificationModelDto {
    private Long id;

    private Integer isRead;

    private String notifyType;

    private String createdAt;

    private String updatedAt;

    private String nodeId;

    private String spaceId;

    private Long toUser;

    private String templateId;

    private Long fromUser;

    private String notifyBody;
    /**
     * 行数
     */
    private Integer rowNo;
}
