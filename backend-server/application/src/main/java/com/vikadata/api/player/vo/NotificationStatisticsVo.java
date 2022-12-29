package com.vikadata.api.player.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * Message statistics
 * </p>
 */
@Data
@Builder
@ApiModel("Message statistics")
public class NotificationStatisticsVo {
    @ApiModelProperty(value = "Number of messages read", example = "1")
    private Integer readCount;

    @ApiModelProperty(value = "Total number of messages", example = "1")
    private Integer totalCount;

    @ApiModelProperty(value = "Number of unread messages", example = "1")
    private Integer unReadCount;
}
