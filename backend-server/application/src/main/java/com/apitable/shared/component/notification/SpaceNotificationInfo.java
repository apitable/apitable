/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.component.notification;

import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.io.Serializable;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * notification info.
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

    /**
     * node info.
     */
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
