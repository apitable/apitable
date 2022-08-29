package com.vikadata.api.component.notification;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 通知渲染需要的字段
 * </p>
 *
 * @author zoe zheng
 * @date 2020/6/15 4:24 下午
 */
@Data
@Builder
public class NotificationRenderField implements Serializable {

    private static final long serialVersionUID = -6481795582248561254L;
    /**
     * 成员ID
     */
    private List<Long> playerIds;
    /**
     * 用户ID
     */
    private Long fromUserId;
    /**
     * spaceId
     */
    private String spaceId;
    /**
     * body中的extras需要存入的值
     */
    private Map<String, Object> bodyExtras;
    /**
     * 节点ID
     */
    private String nodeId;
}
