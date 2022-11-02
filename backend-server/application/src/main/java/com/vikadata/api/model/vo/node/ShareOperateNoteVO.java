package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 分享操作记录
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:16
 */
@Data
@ApiModel("节点分享操作记录视图")
public class ShareOperateNoteVO {

    @ApiModelProperty(value = "操作者", example = "张三", position = 1)
    private String operator;

    @ApiModelProperty(value = "动作名称", example = "开启｜关闭｜刷新", position = 2)
    private String action;

    @ApiModelProperty(value = "操作事件", example = "分享｜ 允许他人保存 ｜ 分享链接", position = 3)
    private String event;

    @ApiModelProperty(value = "操作时间(UTC时间戳)", example = "2020-03-19T16:03:16.000", position = 4)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime timestamp;
}
