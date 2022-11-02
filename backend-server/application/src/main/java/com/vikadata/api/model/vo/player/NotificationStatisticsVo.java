package com.vikadata.api.model.vo.player;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 消息统计
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/25 4:31 下午
 */
@Data
@Builder
@ApiModel("消息统计")
public class NotificationStatisticsVo {
    @ApiModelProperty(value = "已读消息条数", example = "1")
    private Integer readCount;

    @ApiModelProperty(value = "总的消息条数", example = "1")
    private Integer totalCount;

    @ApiModelProperty(value = "未读消息条数", example = "1")
    private Integer unReadCount;
}
