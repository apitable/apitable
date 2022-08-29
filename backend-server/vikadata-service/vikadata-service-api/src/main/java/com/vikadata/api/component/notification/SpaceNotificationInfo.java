package com.vikadata.api.component.notification;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

/**
 * <p>
 * 空间通知内容
 * </p>
 *
 * @author zoe zheng
 * @date 2020/7/10 2:02 下午
 */
@Data
@Builder
public class SpaceNotificationInfo implements Serializable {
    private static final long serialVersionUID = 3984041877744972632L;

    @ApiModelProperty(value = "通知类型", example = "nodeUpdate")
    private String type;

    @ApiModelProperty(value = "用户UUID", example = "3e2f7d835")
    private String uuid;

    @ApiModelProperty(value = "空间ID", example = "spcdddd")
    private String spaceId;

    @ApiModelProperty(value = "通知具体内容")
    private Object data;

    @ApiModelProperty(value = "消息通知的用户socketID", example = "ffdfdasaa")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String socketId;

    @Data
    public static class NodeInfo {
        @ApiModelProperty(value = "节点ID", example = "nod10")
        protected String nodeId;

        @ApiModelProperty(value = "节点名称", example = "这是一个节点")
        protected String nodeName;

        @ApiModelProperty(value = "父节点Id", example = "nod10")
        private String parentId;

        @ApiModelProperty(value = "节点图标", example = ":smile")
        private String icon;

        @ApiModelProperty(value = "封面图", example = "space/2020/5/19/..")
        private String cover;

        @ApiModelProperty(value = "节点是否被分享")
        private Boolean nodeShared;

        @ApiModelProperty(value = "节点描述")
        private String description;

        @ApiModelProperty(value = "目标位置的前一个节点，为空时即移动到了首位", example = "nod10", position = 3)
        private String preNodeId;

        @ApiModelProperty(value = "是否展示记录的历史", example = "0")
        private int showRecordHistory;

    }
}
