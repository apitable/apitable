package com.vikadata.api.component.notification;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * notification render field
 * </p>
 *
 * @author zoe zheng
 */
@Data
@Builder
public class NotificationRenderField implements Serializable {

    private static final long serialVersionUID = -6481795582248561254L;

    private List<Long> playerIds;

    private Long fromUserId;

    private String spaceId;

    private Map<String, Object> bodyExtras;

    private String nodeId;
}
