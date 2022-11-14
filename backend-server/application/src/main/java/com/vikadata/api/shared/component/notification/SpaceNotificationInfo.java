package com.vikadata.api.shared.component.notification;

import java.io.Serializable;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * notification info
 * </p>
 *
 * @author zoe zheng
 */
@Data
@Builder
public class SpaceNotificationInfo implements Serializable {
    private static final long serialVersionUID = 3984041877744972632L;

    private String type;

    private String uuid;

    private String spaceId;

    private Object data;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String socketId;

    @Data
    public static class NodeInfo {

        protected String nodeId;

        protected String nodeName;

        private String parentId;

        private String icon;

        private String cover;

        private Boolean nodeShared;

        private String description;

        private String preNodeId;

        private int showRecordHistory;
    }
}
