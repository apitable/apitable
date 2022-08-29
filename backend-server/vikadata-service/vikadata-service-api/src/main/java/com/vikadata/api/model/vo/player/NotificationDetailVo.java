package com.vikadata.api.model.vo.player;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.constants.NotificationConstants;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 用户消息通知列表
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/12 3:16 下午
 */
@Data
@Builder(toBuilder = true)
@ApiModel("用户消息通知列表")
public class NotificationDetailVo {
    @ApiModelProperty(value = "消息ID", example = "1261273764218")
    private String id;

    @ApiModelProperty(value = "是否已读1已读,0未读", example = "1")
    private Integer isRead;

    @ApiModelProperty(value = "通知类型", example = "system")
    private String notifyType;

    @ApiModelProperty(value = "创建时间", example = "2020-03-18 15:29:59")
    private String createdAt;

    @ApiModelProperty(value = "更新时间", example = "2020-03-18 15:29:59")
    private String updatedAt;

    @Deprecated
    @ApiModelProperty(value = "被通知用户ID", example = "1261273764218")
    private String toUserId;

    @ApiModelProperty(value = "被通知用户uuid", example = "aaaabb")
    private String toUuid;

    @ApiModelProperty(value = "发送通知用户")
    private PlayerBaseVo fromUser;

    @ApiModelProperty(value = "通知内容")
    private NotifyBody notifyBody;

    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @ApiModelProperty(value = "当天通知行数")
    private Integer rowNo;

    @ApiModelProperty(value = "通知模版ID")
    private String templateId;

    @Data
    @Builder
    @ApiModel("通知内容")
    public static class NotifyBody {
        @ApiModelProperty(value = "发送通知用户", example = "zoe在自定义维格表@了你3次")
        @Deprecated
        private String template;

        @ApiModelProperty(value = "发送通知用户", example = "空间消息")
        private String title;

        @ApiModelProperty(value = "节点信息")
        private Node node;

        @ApiModelProperty(value = "空间信息")
        private Space space;

        @ApiModelProperty(value = "通知额外字段" + NotificationConstants.BODY_EXTRAS_DESC,
                example = NotificationConstants.BODY_EXTRAS_EXAMPLE)
        private JSONObject extras;

        @ApiModelProperty(value = "通知跳转")
        private Intent intent;

    }

    @Data
    @Builder
    @ApiModel("通知跳转")
    public static class Intent {
        @ApiModelProperty(value = "跳转链接", example = "https://vika.cn")
        private String url;
    }

    @Data
    @Builder
    @ApiModel("node")
    public static class Node {
        @ApiModelProperty(value = "节点ID")
        private String nodeId;

        @ApiModelProperty(value = "节点信息")
        private String nodeName;

        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        @ApiModelProperty(value = "节点icon")
        private String icon;
    }

    @Data
    @Builder
    @ApiModel("space")
    public static class Space {
        @ApiModelProperty(value = "空间ID")
        private String spaceId;

        @ApiModelProperty(value = "空间名称")
        private String spaceName;

        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        @ApiModelProperty(value = "空间头像")
        private String logo;
    }

}
